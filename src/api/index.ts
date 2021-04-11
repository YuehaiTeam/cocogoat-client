// @ts-ignore
import FlyConstrustor from 'flyio/dist/npm/fly'
// @ts-ignore
import { Fly } from 'flyio/index'
const fly: Fly = new FlyConstrustor()
export const flyAny: Fly = new FlyConstrustor()
import { ElNotification } from 'element-plus'
/* HTTP Error handling */
// @ts-ignore
import ExtendableError from 'extendable-error-class'
import { API_BASE } from '@/config'
class HTTPError extends ExtendableError {
    // @ts-ignore
    constructor(err) {
        super(err.message)
        // eslint-disable-next-line guard-for-in
        for (const i in err) {
            // @ts-ignore
            this[i] = err[i]
        }
        // @ts-ignore
        this.name = 'HTTPError'
    }
}
fly.config.baseURL = API_BASE
fly.interceptors.request.use((request) => {
    if (request.headers['Content-Type'] === '') {
        delete request.headers['Content-Type']
    }
    return request
})
flyAny.interceptors.request.use((request) => {
    if (request.headers['Content-Type'] === '') {
        delete request.headers['Content-Type']
    }
    return request
})
fly.interceptors.response.use(
    (response) => response,
    function (error: any) {
        const errPrefix = error.request.metaErrorPrefix || '出错了！'
        const newErr = new HTTPError(error)
        if (!error.response) {
            ElNotification({
                type: 'error',
                title: errPrefix,
                message: error.message,
            })
        } else if (!error.request.metaIgnoreErr || !error.request.metaIgnoreErr.includes(error.response.status)) {
            ElNotification({
                type: 'error',
                message:
                    typeof error.response.data === 'string'
                        ? error.response.data
                        : getErrorMessage(error.response.data),
            })
        }
        return Promise.reject(newErr)
    },
)
function getErrorMessage(data: any): string {
    if (data.error) return data.error
    if (data.msg) return data.msg
    if (data.message) return data.message
    return JSON.stringify(data)
}
export default fly
