import { parentPort } from 'worker_threads'
// @ts-ignore
import ViGEmClient from 'vigemclient'
let client: any
let controller: any
export async function joystickWorkerInit() {
    if (!parentPort) return
    client = new ViGEmClient()
    client.connect()
    console.log('ViGEm created')
    controller = client.createX360Controller()
    controller.connect()
    controller.updateMode = 'manual'
    console.log('ViGEm started')
    // eslint-disable-next-line complexity
    parentPort.on('message', async (event) => {
        if (!parentPort) return
        if (event.event === 'exit') {
            console.log('Worker exit')
            controller.disconnect()
            process.exit()
        }
        if (event.event === 'keydown') {
            const keycode: number = event.data.rawcode
            switch (keycode) {
                case 37:
                    controller.axis.leftX.setValue(-1)
                    controller.update()
                    break
                case 39:
                    console.log('RD', Date.now())
                    controller.axis.leftX.setValue(1)
                    controller.update()
                    break
                case 38:
                    controller.axis.leftY.setValue(1)
                    controller.update()
                    break
                case 40:
                    controller.axis.leftY.setValue(-1)
                    controller.update()
                    break
                case 33:
                    controller.button.LEFT_SHOULDER.setValue(true)
                    controller.update()
                    break
                case 34:
                    controller.button.RIGHT_SHOULDER.setValue(true)
                    controller.update()
                    break
                case 88:
                    controller.button.X.setValue(true)
                    controller.update()
                    break
                case 89:
                    controller.button.Y.setValue(true)
                    controller.update()
                    break
                case 66:
                    controller.button.B.setValue(true)
                    controller.update()
                    break
                case 65:
                    controller.button.A.setValue(true)
                    controller.update()
                    break
                case 27:
                    controller.button.START.setValue(true)
                    controller.update()
                    break
                default:
            }
        }
        if (event.event === 'keyup') {
            const keycode: number = event.data.rawcode
            switch (keycode) {
                case 37:
                    controller.axis.leftX.setValue(0)
                    controller.update()
                    break
                case 39:
                    console.log('RU', Date.now())
                    controller.axis.leftX.setValue(0)
                    controller.update()
                    break
                case 38:
                    controller.axis.leftY.setValue(0)
                    controller.update()
                    break
                case 40:
                    controller.axis.leftY.setValue(0)
                    controller.update()
                    break
                case 33:
                    controller.button.LEFT_SHOULDER.setValue(false)
                    controller.update()
                    break
                case 34:
                    controller.button.RIGHT_SHOULDER.setValue(false)
                    controller.update()
                    break
                case 88:
                    controller.button.X.setValue(false)
                    controller.update()
                    break
                case 89:
                    controller.button.Y.setValue(false)
                    controller.update()
                    break
                case 66:
                    controller.button.B.setValue(false)
                    controller.update()
                    break
                case 65:
                    controller.button.A.setValue(false)
                    controller.update()
                    break
                case 27:
                    controller.button.START.setValue(false)
                    controller.update()
                    break
                default:
            }
        }
    })
}
