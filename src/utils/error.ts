import {ElMessage as messageTip, ElMessageBox as messageBox} from 'element-plus'
import router from '../router/index'
import {ResponseCode} from '@/types/built-in'

/**
 * HTTP错误处理
 */
export function httpErrorHandler(response: any) {
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
    const messageExists = document.querySelector('.is-message-box') !== null
    if (response.status === 404 || isJson && code === ResponseCode.NOT_FOUND) {
        messageTip.error('页面不存在')
    } else if (response.status === 500 || isJson && code === ResponseCode.ERROR) {
        messageTip.error('服务器异常')
    } else if (response.status === 401 || isJson && code === ResponseCode.UNAUTHORIZED) {
        if (messageExists) {
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
        if (messageExists) {
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
    } else if (response?.message) {
        messageTip.error(response.message)
    } else {
        messageTip.error('发生了未知错误')
    }
}
