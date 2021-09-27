import { SplitResults } from './imageProcess'
import { Artifact, ArtifactParam } from '@/typings/Artifact'
import { ArtifactNamesAll, ArtifactParamTypesAll } from '@/typings/ArtifactMap'
import { detectStars, detectLock, textCNEN, textNumber, textBestmatch, findLowConfidence } from './postRecognize'
import { ArtifactReverse } from '@/i18n/artifactReverse'

const ocrCorrectionMap = [
    ['莉力', '攻击力'],
    ['医力', '攻击力'],
    ['鬼已装备', '魈已装备'],
    ['魁已装备', '魈已装备'],
    ['宗室之钢', '宗室之翎'],
    ['宗室之邻', '宗室之翎'],
    ['宗室之领', '宗室之翎'],
    ['生花', '生之花'],
    ['角斗士的耐醉', '角斗士的酣醉'],
    ['角斗士的希翼', '角斗士的希冀'],
    ['星罗圭壁之暑', '星罗圭璧之晷'],
    ['宗室银瓷', '宗室银瓮'],
    ['雷鸟的冷阀', '雷鸟的怜悯'],
    ['雷灾的子遗', '雷灾的孑遗'],
]

// eslint-disable-next-line complexity
export async function recognizeArtifact(
    ocrres: Record<string, any>,
    ret: SplitResults,
): Promise<[Artifact, string[], any]> {
    const potentialErrors: string[] = []

    /* 星数 */
    const stars = detectStars(ret.color.canvas)

    const lock = detectLock(ret.lock.canvas)

    /* 标题 */
    if (!ocrres.title || !ocrres.title.text) {
        throw new Error("Title cant't be empty")
    }
    let name = textCNEN(ocrres.title.text)

    for (const i of ocrCorrectionMap) {
        name = name.replace(i[0], i[1])
    }

    if (!ArtifactNamesAll.includes(name)) {
        name = textBestmatch(name, ArtifactNamesAll)
    }

    name = ArtifactReverse.names[name] || name

    /* 等级 */
    if (!ocrres.level || !ocrres.level.text) {
        throw new Error("Level cant't be empty")
    }
    let level = Number(
        textNumber(
            ocrres.level.text
                .toLowerCase()
                .replace(/^1.0$/, '0')
                .replace(/o/g, '0')
                .replace(/古/g, '0')
                .replace(/土/g, '1')
                .replace(/书/g, '8')
                .replace(/福/g, '8')
                .replace(/花/g, '8')
                .replace(/吉/g, '10')
                .replace(/112/g, '12'),
        ),
    )
    level = level > 20 ? 20 : level

    /* 主词条 */
    if (!ocrres.main || !ocrres.main.text) {
        throw new Error("Main cant't be empty")
    }
    const [main, maybeError] = recognizeParams(ocrres.main.text.replace(/\s/g, ''), true)
    if (maybeError) {
        potentialErrors.push(maybeError)
    }
    /* 副词条 */
    if (!ocrres.sub0 || !ocrres.sub0.text) {
        throw new Error("Sub cant't be empty")
    }
    const subOrigArray = []
    for (let i = 0; i < 4; i++) {
        if (ocrres[`sub${i}`]) {
            subOrigArray.push(ocrres[`sub${i}`].text.replace(/\s/g, ''))
        }
    }
    const subTextArray = santizeParamsArray(
        subOrigArray.filter((e: string) => {
            return e.trim() !== ''
        }),
    )
    const sub = []
    try {
        for (const i of subTextArray) {
            const [subData, maybeError] = recognizeParams(i)
            sub.push(subData)
            if (maybeError) {
                potentialErrors.push(maybeError)
            }
        }
    } catch (e) {
        console.log(e)
    }

    /* 副词条低置信度检查 */
    for (let i = 0; i < 4; i++) {
        if (ocrres[`sub${i}`]) {
            potentialErrors.push(...findLowConfidence(ocrres[`sub${i}`], 80, true))
        }
    }

    /* 主词条低置信度检查 */
    potentialErrors.push(...findLowConfidence(ocrres.main, 80, true))
    return [
        {
            id: Date.now(),
            name,
            stars,
            lock,
            level,
            user: '',
            main,
            sub,
        },
        potentialErrors,
        ocrres,
    ]
}
/**
 * 对副词条数组可能出现加号丢失的情况进行预处理
 * 若本行有加号，则本行及之前所有行都合法
 * 若本行无加号，则暂不处理，等待后续判断
 */
function santizeParamsArray(input: string[]): string[] {
    const array = [...input] // clone it
    const result: Set<string> = new Set()
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i].replace(/十/g, '+').replace(/\s/g, '')
        if (array[i].includes('+')) {
            for (let j = 0; j <= i; j++) {
                result.add(array[j])
            }
        }
    }
    return [...result]
}
function recognizeParams(text: string, main = false): [ArtifactParam, string | null] {
    let newtext = text
    for (const i of ocrCorrectionMap) {
        newtext = newtext.replace(i[0], i[1])
    }

    let maybeError = null
    const rawName = textCNEN(newtext)
    let value = textNumber(newtext)
    let name = textBestmatch(rawName, ArtifactParamTypesAll)
    name = ArtifactReverse.params[name] || name

    /*
     * PaddleOCR会将逗号(,)识别成点(.)
     * 并且可能把百分号识别为数字
     * 此处对点后3位及以上的把点去掉
     * 两位的把最后一位去掉
     */
    value = value.replace(/\.\./g, '.')
    const [, b] = value.split('.')
    if (b && b.length >= 3) {
        value = value.replace(/\./g, '')
    }
    if (b && b.length === 2) {
        value = value.substr(0, value.length - 1)
    }

    /*
     * 词条属性的简单区间处理
     *
     * 百分比数字按分析通常不超过主70%副50%；且应该>1%
     * 固定数字按分析通常不超过主6000副2000
     * 数据来源：https://wiki.biligame.com/ys/圣遗物属性
     *
     * 若出现此类情形，一般直接认为是识别错误且是多识别一位数字
     * 因此直接将第一位数字去除，并加入到疑似错误列表中
     */
    if (value.includes('.')) {
        const uplimit = main ? 70 : 50
        const numval = Number(value)
        value += '%'
        if (numval > uplimit) {
            console.log('检测到异常固定百分比', value, '已修改为', value.substr(1))
            value = value.substr(1)
            maybeError = value
        } else if (numval < 1) {
            maybeError = value
        }
    } else {
        const uplimit = main ? 6000 : 2000
        if (Number(value) > uplimit) {
            console.log('检测到异常固定数字', value, '已修改为', value.substr(1))
            value = value.substr(1)
            maybeError = value
        }
    }
    return [
        {
            name,
            value,
        },
        maybeError,
    ]
}
