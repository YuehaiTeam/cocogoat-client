import path from 'path'
import { config } from './index'
import { parentPort } from 'worker_threads'
// @ts-ignore
import * as nd from 'nd4js'
import fsex from 'fs-extra'
export function softmax(logits: number[]) {
    const maxLogit = Math.max(...logits)
    const scores = logits.map((l) => Math.exp(l - maxLogit))
    const denom = scores.reduce((a, b) => a + b)
    return scores.map((s) => s / denom)
}
export async function onnxImageWorkerInit() {
    if (!parentPort) return
    const ort = require('onnxruntime-node')
    const onnxModel = path.join(config.dataDir, 'onnx', 'images.onnx')
    const onnxMap = path.join(config.dataDir, 'onnx', 'images.json')
    const session = await ort.InferenceSession.create(onnxModel)
    const map = await fsex.readJSON(onnxMap)
    parentPort.postMessage({
        event: 'ready',
    })
    parentPort.on('message', async (event) => {
        if (!parentPort) return
        if (!session) return
        if (event.event === 'exit') {
            console.log('Worker exit')
            process.exit()
        }
        if (event.event === 'recognize') {
            const { data } = event.message.image
            // 传入图片为RGBA
            let mat = nd.array('float32', { shape: Int32Array.from([64, 64, 4]), data })
            // 转置
            mat = mat.transpose(2, 0, 1)
            let ary: number[] = mat.toNestedArray()
            // 去除透明通道
            ary.splice(3, 1)
            ary = ary.flat(2)
            // 转为Tensor
            ary = ary.map((x) => x / 255)
            const tensor = new ort.Tensor(Float32Array.from(ary), [1, 3, 64, 64])
            const feeds = { input: tensor }
            const results = await session.run(feeds)
            const output = softmax(results.output.data)
            const resultR: { name: string; prob: number }[] = []
            for (const i in output) {
                if (output.hasOwnProperty(i)) {
                    resultR.push({
                        name: map[i],
                        prob: Math.round(output[i] * 10000) / 100,
                    })
                }
            }
            resultR.sort((a, b) => b.prob - a.prob)
            reply(event, { result: resultR.slice(0, 5) })
        }
    })
}
function reply(event: any, message: any) {
    if (!parentPort) return
    parentPort.postMessage({
        event: 'reply',
        message,
        reply: event.reply,
        id: event.id,
    } as { event: string; message: any; reply?: any; id?: string })
}
