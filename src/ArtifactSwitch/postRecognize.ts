interface Block {
    x: number
    y: number
    width: number
    height: number
}
export function santizeBlocks(origBlocks: Block[], canvas: HTMLCanvasElement) {
    let blocks = origBlocks.slice()
    /* 过滤窗体区块 */
    blocks = blocks.filter((e) => {
        return Math.abs(e.width - canvas.width) > 100
    })
    /* 过滤噪声区块 */
    blocks = blocks.filter((e) => {
        return e.width > canvas.width / 16
    })
    /* 行列排序 */
    /** 我们认为每行圣遗物不超过16个 */
    const xDiff = canvas.width / 16
    /** 我们认为下每列圣遗物不超过10个 */
    const yDiff = canvas.width / 10
    blocks = blocks.sort((a, b) => {
        const absDiff = Math.abs(a.x - b.x)
        if (absDiff > xDiff) {
            return a.x > b.x ? 1 : -1
        } else {
            return 0
        }
    })
    blocks = blocks.sort((a, b) => {
        const absDiff = Math.abs(a.y - b.y)
        if (absDiff > yDiff) {
            return a.y > b.y ? 1 : -1
        } else {
            return 0
        }
    })
    /* 判断行数和列数 */
    /** 每行个数 / 列数 */
    let cols = 0
    /** 每列个数 / 行数 */
    let rows = 0
    let colsFinished = false
    for (const i of blocks) {
        if (cols !== 0 && Math.abs(i.x - blocks[0].x) < xDiff) {
            // 重新回到第一个
            colsFinished = true
            rows++
        }
        if (!colsFinished) cols++
    }
    rows++
    return { blocks, cols, rows }
}
export function getBlockCenter(block: Block) {
    return { x: block.x + block.width / 2, y: block.y + block.height / 2 }
}
export function calcScrollHeight(blocks: Block[], rows: number) {
    const firstCenter = getBlockCenter(blocks[0])
    const lastCenter = getBlockCenter(blocks[blocks.length - 1])
    const yDistance = lastCenter.y - firstCenter.y
    const avgHeight = Math.round(yDistance / rows)
    return avgHeight + blocks[blocks.length - 1].height * 1.2
}
