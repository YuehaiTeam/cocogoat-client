import { createColorFilter } from './imageProcess'
export const padding = 50
export default <Record<string, string | false | ((ctx: CanvasRenderingContext2D, w: number, h: number) => void)>>{
    title: 'invert(100%) brightness(180%) grayscale(100%) contrast(300%)',
    color: false,
    main: 'invert(100%) brightness(125%) grayscale(100%) contrast(700%)',
    level: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        createColorFilter(48, 56, 66, 50, true)(ctx, w, h)
        const imageData = ctx.getImageData(0, 0, w, h)
        /* 搜索左上角 */
        let l = 0
        let t = 0
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i] >= 200) {
                l = (i / 4) % w
                t = i / 4 / w
                break
            }
        }
        /* 搜索右下角 */
        let r = 0
        let b = 0
        for (let j = imageData.data.length - 1; j >= 0; j -= 4) {
            if (imageData.data[j + 1] >= 200) {
                r = (j / 4) % w
                b = j / 4 / w
                break
            }
        }

        for (let i = 0; i < imageData.data.length; i += 4) {
            if (
                (i / 4) % w < l || // 左上角左边
                i / 4 / w < t || // 左上角上面
                (i / 4) % w > r || // 右下角右边
                i / 4 / w > b // 右下角下面
            ) {
                imageData.data[i + 0] = 255
                imageData.data[i + 1] = 255
                imageData.data[i + 2] = 255
            }
        }
        ctx.putImageData(imageData, 0, 0)
    },
    sub: 'brightness(110%) grayscale(100%) contrast(700%)',
    user: 'brightness(110%) grayscale(100%) contrast(700%)',
}
