// @ts-ignore
import { closest } from 'color-diff'
import { Page } from 'tesseract.js'
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
export function textBestmatch(text: string, list: string[]) {
    if (list.includes(text)) return text
    let matches = findBestMatch(text, list)
    if (matches.bestMatch.rating <= 0.1) {
        matches = findBestMatch(text, list, true)
    }
    if (matches.bestMatch.rating <= 0.1) return ''
    return matches.bestMatch.target
}
export function textChinese(t: string) {
    const str = t.match(/[\u4e00-\u9fa5]/g)?.join('') || ''
    if (!str) throw new Error(`${t} doesn't contains chinese`)
    return str
}
export function textNumber(t: string) {
    const str = t.replace(/[^\d.]/g, '')
    if (!str) throw new Error(`${t} doesn't contains number`)
    return str
}

function compareTwoStrings(firstStr: string, secondStr: string) {
    const first = firstStr.replace(/\s+/g, '')
    const second = secondStr.replace(/\s+/g, '')

    if (first === second) return 1 // identical or empty
    if (first.length < 2 || second.length < 2) return 0 // if either is a 0-letter or 1-letter string

    const firstBigrams = new Map()
    for (let i = 0; i < first.length; i++) {
        const bigram = first.substring(i, i + 1)
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1

        firstBigrams.set(bigram, count)
    }
    let intersectionSize = 0
    for (let i = 0; i < second.length; i++) {
        const bigram = second.substring(i, i + 1)
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0

        if (count > 0) {
            firstBigrams.set(bigram, count - 1)
            intersectionSize++
        }
    }

    return (2.0 * intersectionSize) / (first.length + second.length - 2)
}
function compareTwoStrings2(firstStr: string, secondStr: string) {
    const first = firstStr.replace(/\s+/g, '')
    const second = secondStr.replace(/\s+/g, '')

    if (first === second) return 1 // identical or empty
    if (first.length < 2 || second.length < 2) return 0 // if either is a 0-letter or 1-letter string

    const firstBigrams = new Map()
    for (let i = 0; i < first.length - 1; i++) {
        const bigram = first.substring(i, i + 2)
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1

        firstBigrams.set(bigram, count)
    }

    let intersectionSize = 0
    for (let i = 0; i < second.length - 1; i++) {
        const bigram = second.substring(i, i + 2)
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0

        if (count > 0) {
            firstBigrams.set(bigram, count - 1)
            intersectionSize++
        }
    }

    return (2.0 * intersectionSize) / (first.length + second.length - 2)
}
export function findBestMatch(mainString: string, targetStrings: string[], singleWord = false) {
    const ratings = []
    let bestMatchIndex = 0

    for (let i = 0; i < targetStrings.length; i++) {
        const currentTargetString = targetStrings[i]
        const currentRating = singleWord
            ? compareTwoStrings(mainString, currentTargetString)
            : compareTwoStrings2(mainString, currentTargetString)
        ratings.push({ target: currentTargetString, rating: currentRating })
        if (currentRating > ratings[bestMatchIndex].rating) {
            bestMatchIndex = i
        }
    }

    const bestMatch = ratings[bestMatchIndex]

    return { ratings: ratings, bestMatch: bestMatch, bestMatchIndex: bestMatchIndex }
}
/**
 * OCR低置信度检测
 * @param page - OCR结果页
 * @param lowerThen - 最低置信度
 * @param numberOnly - 是否只对数字处理
 * @returns 所有可能错误的文本数组
 */
export function findLowConfidence(page: Page, lowerThan: number, numberOnly = true) {
    const potentialErrors: string[] = []
    for (const i of page.words) {
        if (i.confidence > 0 && i.confidence < lowerThan) {
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
