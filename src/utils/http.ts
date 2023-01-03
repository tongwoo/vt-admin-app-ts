import {store} from "@/store/index"
import {GlobalState} from "@/store/types"
import axios, {AxiosResponse, AxiosInstance, AxiosResponseHeaders} from 'axios'
import {API_PATH_DEFAULT} from "@/constants/api-path"
import {ResponseCode} from "@/types/built-in"
import {Store} from "vuex"

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
http.interceptors.request.use(
    function (request) {
        const token = (store as Store<GlobalState>).state.user.authorization
        if (request.headers !== undefined && token) {
            request.headers.authorization = token
        }
        return request
    }
)

//响应拦截器
http.interceptors.response.use(
    function (response) {
        const normalized = normalize(response)
        const codes = [
            ResponseCode.UNAUTHORIZED,
            ResponseCode.FORBIDDEN,
            ResponseCode.NOT_FOUND
        ]
        if (
            //根据实际需要使用 status 或者 code 来判断状态码
            //codes.indexOf(normalized?.status) !== -1 ||
            codes.indexOf(normalized.data?.code) !== -1
        ) {
            return Promise.reject({
                response: normalized
            })
        }
        return normalized
    },
    function (error) {
        if (error?.response === undefined) {
            return Promise.reject(error.message)
        }
        //需要继续抛异常的相关状态码，其他类型错误交给业务层处理
        const codes = [
            ResponseCode.UNAUTHORIZED,
            ResponseCode.FORBIDDEN,
            ResponseCode.NOT_FOUND
        ]
        if (
            //根据实际需要使用 status 或者 code 来判断状态码
            //codes.indexOf(error.response?.status) !== -1 ||
            codes.indexOf(error.response?.data?.code) !== -1
        ) {
            return Promise.reject(error)
        }
        return normalize(error.response)
    }
)

/**
 * 对AxiosResponse进行包装
 */
function normalize(response: AxiosResponse): AxiosResponse {
    response.isOk = response.status == 200
    //将响应体转换成HttpResponse结构
    if (typeof response.data === 'object') {
        if (response.data?.msg !== undefined) {
            response.data.message = response.data.msg
            delete response.data.msg
        }
        response.isOk = ResponseCode.isOk(Number(response.data?.code))
    }
    return response
}

export interface HttpResponse<T = any> {
    //操作是否成功
    success: boolean,
    //消息
    message: string,
    //数据
    data?: T
}

/**
 * 从响应头中获取附件名称
 * @param {AxiosResponseHeaders} headers 响应头
 */
export function getAttachmentName(headers: AxiosResponseHeaders): string {
    const disposition = headers['Content-Disposition'] ?? headers['content-disposition']
    if (!disposition) {
        return '未命名'
    }
    const keyword = "filename*=utf-8''"
    const offset = disposition.indexOf(keyword)
    if (offset !== -1) {
        const name = disposition.substr(offset + keyword.length)
        return decodeURI(name)
    }
    const keyword2 = 'filename="'
    const offset2 = disposition.indexOf(keyword2)
    if (offset2 !== -1) {
        const name2 = disposition.substr(offset2 + keyword2.length, disposition.length - offset2 - keyword2.length - 1)
        return decodeURI(name2)
    }
    const keyword3 = 'filename='
    const offset3 = disposition.indexOf(keyword3)
    if (offset3 !== -1) {
        const name3 = disposition.substr(offset3 + keyword3.length)
        return decodeURI(name3)
    }
    return 'unknown'
}

export {
    http
}

