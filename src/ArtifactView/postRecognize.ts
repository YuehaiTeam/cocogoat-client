// @ts-ignore
import { closest } from 'color-diff'
const color_palette = [
    { R: 189, G: 105, B: 50 }, // 五星
    { R: 162, G: 86, B: 225 }, // 四星
    { R: 80, G: 128, B: 204 }, // 三星
    { R: 41, G: 144, B: 114 }, // 两星
    { R: 115, G: 118, B: 141 }, // 一星
]
const color_rmap = {
    189: 5,
    162: 4,
    80: 3,
    41: 2,
    115: 1,
}
export function detectStars(colorCanvas: HTMLCanvasElement) {
    const ctx = colorCanvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported!')
    const imgData = ctx.getImageData(0, 0, colorCanvas.width, colorCanvas.height)
    const mapColor = {
        R: imgData.data[0],
        G: imgData.data[1],
        B: imgData.data[2],
    }
    const closestColor = closest(mapColor, color_palette)
    // @ts-ignore
    return color_rmap[closestColor.R] || 0
}
export function detectLock(lockCanvas: HTMLCanvasElement) {
    const ctx = lockCanvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported!')
    const imgData = ctx.getImageData(0, 0, lockCanvas.width, lockCanvas.height)
    const unlock_threshold = 140
    const pixels = imgData.data.length / imgData.width / imgData.height
    let higher_count = 0
    let lower_count = 0
    for (let i = 0; i < imgData.data.length; i += pixels) {
        let up_threshold = 0
        for (let j = 0; j < 3; j++) if (imgData.data[i + j] > unlock_threshold) up_threshold++
        if (up_threshold === 3) higher_count++
        else lower_count++
    }
    return lower_count > higher_count
}
export function textBestmatch(text: string, list: string[]) {
    if (list.includes(text)) return text
    const matches = findBestMatch(text.replace(/\s\s+/g, ' '), list)
    if (!/[\\u4E00-\\u9FFF]+/g.test(text) && matches.bestMatch.rating > 3) return ''
    return matches.bestMatch.target
}
export function textChinese(t: string) {
    const str = t.match(/[\u4e00-\u9fa5]/g)?.join('') || ''
    if (!str) throw new Error(`${t} doesn't contains chinese`)
    return str
}
export function textCNEN(t: string) {
    return t.match(/[a-zA-Z\u4e00-\u9fa5]/g)?.join('') || ''
}
export function textNumber(t: string) {
    const str = t.replace(/[^\d.]/g, '')
    if (!str) throw new Error(`${t} doesn't contains number`)
    return str
}

export function levenshteinEditDistance(value: string, other: string): number {
    let distance: number
    let distanceOther: number
    const codes: number[] = []
    const cache: number[] = []

    if (value === other) {
        return 0
    }

    if (value.length === 0) {
        return other.length
    }

    if (other.length === 0) {
        return value.length
    }

    let index = 0

    while (index < value.length) {
        codes[index] = value.charCodeAt(index)
        cache[index] = ++index
    }

    let indexOther = 0
    let result
    while (indexOther < other.length) {
        const code = other.charCodeAt(indexOther)
        result = distance = indexOther++
        index = -1

        while (++index < value.length) {
            distanceOther = code === codes[index] ? distance : distance + 1
            distance = cache[index]
            cache[index] = result =
                distance > result
                    ? distanceOther > result
                        ? result + 1
                        : distanceOther
                    : distanceOther > distance
                    ? distance + 1
                    : distanceOther
        }
    }

    return result || Infinity
}
export function findBestMatch(mainString: string, targetStrings: string[]) {
    const ratings = []
    let bestMatchIndex = 0
    let confuseLevel = 0

    for (let i = 0; i < targetStrings.length; i++) {
        const currentTargetString = targetStrings[i]
        const currentRating = levenshteinEditDistance(mainString, currentTargetString)
        ratings.push({ target: currentTargetString, rating: currentRating })
        if (currentRating === 0 || currentRating < ratings[bestMatchIndex].rating) {
            bestMatchIndex = i
            confuseLevel = 0
        } else if (currentRating === ratings[bestMatchIndex].rating) {
            confuseLevel++
        }
    }

    const bestMatch = ratings[bestMatchIndex]
    if (confuseLevel) bestMatch.rating = 10

    return { ratings: ratings, bestMatch: bestMatch, bestMatchIndex: bestMatchIndex }
}
/**
 * OCR低置信度检测
 * @param page - OCR结果页
 * @param lowerThen - 最低置信度
 * @param numberOnly - 是否只对数字处理
 * @returns 所有可能错误的文本数组
 */
export function findLowConfidence(page: any, lowerThan: number, numberOnly = true) {
    const potentialErrors: string[] = []
    for (const i of page.words) {
        if (i.confidence > 0 && i.confidence < lowerThan / 100) {
            // 置信度低于预期
            // 如果只判断数字
            if (numberOnly) {
                try {
                    potentialErrors.push(`${textNumber(i.text)}${i.text.includes('%') ? '%' : ''}`)
                } catch (e) {
                    // not a number
                }
            } else {
                potentialErrors.push(i.text)
            }
        }
    }
    return potentialErrors
}
