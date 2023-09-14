import {ElMessage as messageTip, ElMessageBox as messageBox} from 'element-plus'
import router from '../router/index'
import {ResponseCode} from '@/types/built-in'
import setting from '@/setting'

/**
 * HTTP错误处理
 */
export function httpErrorHandler(response: any) {
    messageTip.closeAll()
    if (typeof response === 'string') {
        messageTip.error(response)
        return
    }
    //判断是否是服务端响应异常
    if (!(response?.headers?.['content-type'])) {
        if (response?.message) {
            messageTip.error(response.message)
        } else {
            messageTip.error('网络异常')
        }
        return
    }
    const code = response.data.code
    const isJson = response.headers['content-type']?.includes('application/json')
    if (response.status === 404 || isJson && code === ResponseCode.NOT_FOUND) {
        messageTip.error('页面不存在')
    } else if (response.status === 500 || isJson && code === ResponseCode.ERROR) {
        messageTip.error('服务器异常')
    } else if (response.status === 401 || isJson && code === ResponseCode.UNAUTHORIZED) {
        messageTip.error('凭证已过期')
        if (setting.auth.redirect) {
            router.replace('/login')
        }
    } else if (response.status === 403 || isJson && code === ResponseCode.FORBIDDEN) {
        messageTip.error('无权限')
        if (setting.auth.redirect) {
            router.replace('/login')
        }
    } else if (response?.message) {
        messageTip.error(response.message)
    } else if (response?.data?.message) {
        messageTip.error(response.data.message)
    } else {
        messageTip.error('发生了未知错误')
    }
}
