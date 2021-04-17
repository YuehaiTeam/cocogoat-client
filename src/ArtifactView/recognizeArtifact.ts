import { ocr, SplitResults } from './imageProcess'
import { Artifact, ArtifactParam } from '@/typings/Artifact'
import { ArtifactNames, ArtifactParamTypes, ArtifactSubParamTypes } from '@/typings/ArtifactMap'
import { detectStars, textChinese, textNumber, textBestmatch, findLowConfidence } from './postRecognize'

const ocrCorrectionMap = [
    ['莉力', '攻击力'],
    ['医力', '攻击力'],
    ['鬼已装备', '魈已装备'],
    ['魁已装备', '魈已装备'],
]

export async function recognizeArtifact(ret: SplitResults): Promise<[Artifact, string[], any]> {
    const potentialErrors: string[] = []
    /* OCR */
    const ocrres = await ocr(ret)

    /* 星数 */
    const stars = detectStars(ret.color.canvas)

    /* 标题 */
    if (!ocrres.title || !ocrres.title.text) {
        throw new Error("Title cant't be empty")
    }
    let name = textChinese(ocrres.title.text)
    name = fixOcrText(name)
    if (!ArtifactNames.includes(name)) {
        name = textBestmatch(name, ArtifactNames)
    }

    /* 等级 */
    if (!ocrres.level || !ocrres.level.text) {
        throw new Error("Level cant't be empty")
    }
    const level = Number(textNumber(ocrres.level.text))

    /* 主词条 */
    if (!ocrres.main || !ocrres.main.text) {
        throw new Error("Main cant't be empty")
    }
    const [main, maybeError] = recognizeParams(ocrres.main.text.replace('\n', '+'), true)
    if (maybeError) {
        potentialErrors.push(maybeError)
    }
    /* 副词条 */
    if (!ocrres.sub || !ocrres.sub.text) {
        throw new Error("Sub cant't be empty")
    }
    const subTextArray = ocrres.sub.text.split('\n').filter((e: string) => {
        return e.trim() !== ''
    })
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
    potentialErrors.push(...findLowConfidence(ocrres.sub, 45, true))

    /* 主词条低置信度检查 */
    potentialErrors.push(...findLowConfidence(ocrres.main, 45, true))

    return [
        {
            id: Date.now(),
            name,
            stars,
            level,
            user: '',
            main,
            sub,
        },
        potentialErrors,
        ocrres,
    ]
}
function recognizeParams(text: string, main = false): [ArtifactParam, string | null] {
    /* OCR常见错误预修正 */
    let newtext = text.replace(/\s/g, '').replace('十', '+')
    if (!text.includes('+')) throw new Error(`${text} is not a vaild param`)
    for (const i of ocrCorrectionMap) {
        newtext = newtext.replace(i[0], i[1])
    }

    let maybeError = null

    const [rawName, rawValue] = newtext.split('+')
    const toCompare = main ? ArtifactParamTypes : ArtifactSubParamTypes
    const name = textBestmatch(rawName, toCompare)
    let value
    try {
        value = textNumber(rawValue)
    } catch (e) {
        console.log(newtext)
        throw e
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
    if (/[\u4E00-\u9FA5]+/.test(rawValue)) {
        if (rawValue.includes('人')) {
            console.log('检测到数字包含中文，已修改', rawValue, `1${value}`, value)
            value = `1${value}`
        } else {
            console.log('检测到数字包含中文', rawValue, value)
        }
        maybeError = value
    }
    return [
        {
            name,
            value,
        },
        maybeError,
    ]
}
// TODO：只是一个临时修复
function fixOcrText(name: string) {
    if (name[0] === '终' && name.includes('的时计')) {
        return '终幕的时计'
    }
    return name
}
