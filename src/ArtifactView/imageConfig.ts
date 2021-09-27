export default <
    Record<
        string,
        {
            ignore?: boolean
            singleLine?: boolean
            noPadding?: boolean
            handler?:
                | string
                | false
                | ((ctx: CanvasRenderingContext2D, w: number, h: number, canvas: HTMLCanvasElement, cv: any) => void)
        }
    >
>{
    title: {
        singleLine: true,
        handler: (_ctx, _w, _h, canvas, cv) => {
            const p1 = cv.imread(canvas)
            cv.cvtColor(p1, p1, cv.COLOR_RGB2GRAY)
            cv.threshold(p1, p1, 165, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C)
            const hor_list: number[] = []
            for (let i = 0; i < p1.rows; i++) {
                for (let j = 0; j < p1.cols; j++) {
                    if (p1.ucharPtr(i, j)[0] === 0) {
                        hor_list[i] = hor_list[i] ? hor_list[i] + 1 : 1
                    }
                }
            }
            const pn = []
            let last = -1
            for (let i = 0; i < p1.rows; i++) {
                const t = hor_list[i] > 0 ? 1 : 0
                if (last < 0) {
                    last = t
                    continue
                }
                if (t !== last) {
                    last = t
                    pn.push(i)
                }
            }
            if (pn.length < 4) {
                cv.imshow(canvas, p1)
                p1.delete()
                return
            }
            const canvas2 = document.createElement('canvas')
            cv.imshow(canvas2, p1)
            p1.delete()
            canvas.height = pn[1] - pn[0]
            canvas.width = canvas2.width + canvas2.width * ((pn[1] - pn[0]) / (pn[3] - pn[2]))
            const ctx = canvas.getContext('2d')
            if (!ctx) return
            ctx.drawImage(canvas2, 0, pn[0], canvas2.width, canvas.height, 0, 0, canvas2.width, canvas.height)
            ctx.drawImage(
                canvas2,
                0,
                pn[2],
                canvas2.width,
                pn[3] - pn[2],
                canvas2.width,
                0,
                canvas2.width * ((pn[1] - pn[0]) / (pn[3] - pn[2])),
                canvas.height,
            )
        },
    },
    color: {
        ignore: true,
    },
    lock: {
        ignore: true,
    },
    main: {
        singleLine: true,
        handler: (_ctx, _w, _h, canvas, cv) => {
            const p1 = cv.imread(canvas)
            cv.cvtColor(p1, p1, cv.COLOR_RGB2GRAY)
            cv.threshold(p1, p1, 155, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C)
            const hor_list: number[] = []
            for (let i = 0; i < p1.rows; i++) {
                for (let j = 0; j < p1.cols; j++) {
                    if (p1.ucharPtr(i, j)[0] === 0) {
                        hor_list[i] = hor_list[i] ? hor_list[i] + 1 : 1
                    }
                }
            }
            const pn = []
            let last = -1
            for (let i = 0; i < p1.rows; i++) {
                const t = hor_list[i] > 0 ? 1 : 0
                if (last < 0) {
                    last = t
                    continue
                }
                if (t !== last) {
                    last = t
                    pn.push(i)
                }
            }
            const canvas2 = document.createElement('canvas')
            cv.imshow(canvas2, p1)
            p1.delete()
            canvas.height = pn[1] - pn[0]
            canvas.width = canvas2.width + canvas2.width * ((pn[1] - pn[0]) / (pn[3] - pn[2]))
            const ctx = canvas.getContext('2d')
            if (!ctx) return
            ctx.drawImage(canvas2, 0, pn[0], canvas2.width, canvas.height, 0, 0, canvas2.width, canvas.height)
            ctx.drawImage(
                canvas2,
                0,
                pn[2],
                canvas2.width,
                pn[3] - pn[2],
                canvas2.width,
                0,
                canvas2.width * ((pn[1] - pn[0]) / (pn[3] - pn[2])),
                canvas.height,
            )
        },
    },
    level: {
        singleLine: false,
        handler: (_ctx, _w, _h, canvas, cv) => {
            const p1 = cv.imread(canvas)
            const contours = new cv.MatVector()
            const hierarchy = new cv.Mat()
            cv.threshold(p1, p1, 160, 255, cv.ADAPTIVE_THRESH_MEAN_C)
            cv.cvtColor(p1, p1, cv.COLOR_RGB2GRAY)
            cv.findContours(p1, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
            const data = []
            for (let i = 0; i < contours.size(); i++) {
                data.push(cv.boundingRect(contours.get(i)))
            }
            let border
            for (const i of data) {
                if (i.width < p1.cols / 2 || Math.abs(i.width - p1.cols) < Math.max(2, p1.cols / 30)) continue
                border = i
            }
            if (!border) {
                p1.delete()
                contours.delete()
                hierarchy.delete()
                return
            }
            cv.line(
                p1,
                new cv.Point(0 - p1.cols, border.y / 2),
                new cv.Point(2 * p1.cols, border.y / 2),
                [0, 0, 0, 255],
                border.y + 1,
            )
            cv.line(
                p1,
                new cv.Point(border.x / 2, 0 - p1.rows),
                new cv.Point(border.x / 2, 2 * p1.rows),
                [0, 0, 0, 255],
                border.x + 1,
            )
            cv.line(
                p1,
                new cv.Point(0 - p1.cols, p1.rows - 1),
                new cv.Point(2 * p1.cols, p1.rows - 1),
                [0, 0, 0, 255],
                p1.rows - border.height,
            )
            cv.line(
                p1,
                new cv.Point(p1.cols - 1, 0 - p1.rows),
                new cv.Point(p1.cols - 1, 2 * p1.rows),
                [0, 0, 0, 255],
                p1.cols - border.width,
            )
            cv.bitwise_not(p1, p1)
            cv.imshow(canvas, p1)
            p1.delete()
            contours.delete()
            hierarchy.delete()
        },
    },
    sub: {
        handler: '',
    },
    user: {
        singleLine: true,
        handler: '',
    },
}
