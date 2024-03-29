import {useUserStore} from '@/pinia/user'
import setting from '@/setting'
import axios, {AxiosInstance, AxiosResponseHeaders} from 'axios'
import {API_PATH_DEFAULT} from '@/constants/api-path'
import {ResponseCode} from '@/types/built-in'

declare module 'axios' {
    interface AxiosResponse {
        isOk: boolean
    }
}

/**
 * Http实例
 */
const http: AxiosInstance = axios.create({
    baseURL: API_PATH_DEFAULT,
    timeout: 30000,
    headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    }
})

//请求拦截器
http.interceptors.request.use((request) => {
        //添加授权头
        const token = useUserStore().authorization
        if (request.headers !== undefined && token) {
            request.headers.authorization = token
        }
        return request
    }
)

//响应拦截器
http.interceptors.response.use(
    function (response) {
        response.isOk = true
        if (response.headers['content-type']?.includes('application/json')) {
            //重命名 msg 为 message
            if (response.data?.msg !== undefined) {
                response.data.message = response.data.msg
                delete response.data.msg
            }
            if (!ResponseCode.isOk(response.data?.code)) {
                response.isOk = false
                //未授权、未登录、404 直接抛异常交由 catch 处理
                const codes = [
                    ResponseCode.UNAUTHORIZED,
                    ResponseCode.FORBIDDEN,
                    ResponseCode.NOT_FOUND
                ]
                if (response.data.code === ResponseCode.UNAUTHORIZED && setting.auth.redirect) {
                    window.location.href = '/#/login'
                }
                if (codes.indexOf(response.data.code) !== -1) {
                    return Promise.reject(response)
                }
            }
        }
        return response
    },
    function (error) {
        const response = error?.response
        if (!response) {
            return Promise.reject(error)
        }
        response.isOk = false
        //未授权、未登录、404 直接抛异常交由 catch 处理
        const codes = [401, 403, 404]
        if (response.status === 401 && setting.auth.redirect) {
            window.location.href = '/#/login'
        }
        if (codes.indexOf(response.status) !== -1) {
            return Promise.reject(error.response)
        }
        if (response?.headers?.['content-type']?.includes('application/json')) {
            //重命名 msg 为 message
            if (response.data?.msg !== undefined) {
                response.data.message = response.data.msg
                delete response.data.msg
            }
        }
        return Promise.reject(error.response)
    }
)

/**
 * HTTP常规响应结构
 */
export interface HttpResponse<T = any> {
    [key: string]: any,

    //操作是否成功
    success: boolean,
    //消息
    message: string,
    //数据
    data?: T
}

/**
 * 从响应头中获取文件名
 * @param headers 响应头
 */
export function parseResponseFilename(headers: AxiosResponseHeaders): string {
    const disposition = headers['content-disposition']
    if (!disposition) {
        return '未命名'
    }
    const keyword = 'filename*=utf-8\'\''
    const offset = disposition.indexOf(keyword)
    if (offset !== -1) {
        const name = disposition.substring(offset + keyword.length)
        return decodeURI(name)
    }
    const keyword1 = 'filename*=UTF-8\'\''
    const offset1 = disposition.indexOf(keyword1)
    if (offset1 !== -1) {
        const name = disposition.substring(offset1 + keyword1.length)
        return decodeURI(name)
    }
    const keyword2 = 'filename="'
    const offset2 = disposition.indexOf(keyword2)
    if (offset2 !== -1) {
        const name2 = disposition.substring(offset2 + keyword2.length, disposition.length - offset2 - keyword2.length - 1)
        return decodeURI(name2)
    }
    const keyword3 = 'filename='
    const offset3 = disposition.indexOf(keyword3)
    if (offset3 !== -1) {
        const name3 = disposition.substring(offset3 + keyword3.length)
        return decodeURI(name3)
    }
    return 'unknown'
}

export {
    http
}

