import * as OpenCV from './types/opencv'
import _cv from './opencv.esm'
// @ts-ignore
export const getCV: () => typeof OpenCV = _cv
/**
 * Translate error number from OpenCV into a meaningful message
 * @param cvObject OpenCV object
 * @param err OpenCV error number
 */
export function cvTranslateError(cv: typeof OpenCV, err: any): string | Error | undefined {
    // Code modified from OpenCV TryIt playground
    // https://docs.opencv.org/3.4/d0/d84/tutorial_js_usage.html

    let errorStatement: string | Error | undefined

    if (typeof err === 'undefined') {
        errorStatement = ''
    } else if (typeof err === 'number') {
        if (!isNaN(err)) {
            if (typeof cv !== 'undefined') {
                errorStatement = 'Exception: ' + cv.exceptionFromPtr(err).msg
            }
        }
    } else if (typeof err === 'string') {
        const ptr = Number(err.split(' ')[0])
        if (!isNaN(ptr)) {
            if (typeof cv !== 'undefined') {
                errorStatement = 'Exception: ' + cv.exceptionFromPtr(ptr).msg
            }
        }
    } else if (err instanceof Error) {
        errorStatement = err
    }

    return errorStatement
}
