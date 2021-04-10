import { sleep } from '@/ArtifactView/utils'
import { ipcRenderer } from 'electron'
import robot from 'robotjs'
import { getposition, setTransparent } from './ipc'
robot.setMouseDelay(8)
export async function toWindowPos(dx: number, dy: number) {
    const offsetY = 80
    const offsetX = 2
    const [winx, winy] = await getposition()
    const x = winx + dx + offsetX
    const y = winy + dy + offsetY
    return { x, y }
}
export async function click({ x: dx, y: dy }: { x: number; y: number }) {
    robot.moveMouse(dx, dy)
    await sleep(50)
    robot.mouseClick()
}
export async function scrollUp({ x: dx, y: dy }: { x: number; y: number }, top: number, revertStatus = true) {
    const { x, y } = await toWindowPos(dx, dy)
    await sleep(50)
    robot.moveMouse(x, y)
    await sleep(50)
    robot.mouseClick()
    // robot.scrollMouse(0, top - y)
    // robot.moveMouseSmooth(x, y - top, 8)
    await sleep(400)
    ipcRenderer.send('scrollTick', false)
    // robot.mouseToggle('up')
    await sleep(100)
    if (revertStatus) setTransparent(false)
}
