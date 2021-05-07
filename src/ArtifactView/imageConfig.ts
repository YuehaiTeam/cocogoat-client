import { createColorFilter } from './imageProcess'
export default <
    Record<
        string,
        {
            ignore?: boolean
            singleLine?: boolean
            noPadding?: boolean
            handler?: string | false | ((ctx: CanvasRenderingContext2D, w: number, h: number) => void)
        }
    >
>{
    title: {
        handler: 'invert(100%) brightness(180%) grayscale(100%) contrast(300%)',
        singleLine: true,
    },
    color: {
        ignore: true,
    },
    main: {
        handler: '',
    },
    level: {
        singleLine: true,
        handler: 'invert(100%)',
        oldHandler: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
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
    },
    sub: {
        handler: '',
    },
    user: {
        handler: '',
    },
}
