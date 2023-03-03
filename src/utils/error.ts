import {ElMessage as messageTip, ElMessageBox as messageBox} from "element-plus"
import router from "../router/index"
import {ResponseCode} from "@/types/built-in"
import {AxiosError, AxiosResponse} from "axios"

/**
 * HTTP错误处理
 */
export function httpErrorHandler(response: AxiosResponse) {
    const code = response.data?.code
    const isJson = response.headers['content-type'].includes('application/json')
    const hasMessageBox = document.querySelector('.is-message-box') !== null
    if (response.status === 404 || isJson && code === ResponseCode.NOT_FOUND) {
        messageTip.error('页面不存在')
    } else if (response.status === 500 || isJson && code === ResponseCode.ERROR) {
        messageTip.error('服务器异常')
    } else if (response.status === 401 || isJson && code === ResponseCode.UNAUTHORIZED) {
        if (hasMessageBox) {
            return
        }
        messageBox.confirm('登录凭证已经过期，是否重新登录？', '提示', {
            type: 'warning',
            confirmButtonText: '重新登录',
            cancelButtonText: '否'
        }).then(() => {
            return router.replace('/login')
        }).catch(() => {
            //...
        })
    } else if (response.status === 403 || isJson && code === ResponseCode.FORBIDDEN) {
        if (hasMessageBox) {
            return
        }
        messageBox.confirm('没有权限，是否重新登录？', '提示', {
            type: 'warning',
            confirmButtonText: '重新登录',
            cancelButtonText: '否'
        }).then(() => {
            return router.replace('/login')
        }).catch(() => {
            //...
        })
    } else {
        messageTip.error('网络繁忙，请稍后重试')
    }
}
