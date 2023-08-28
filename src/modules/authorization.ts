import {http, HttpResponse} from "@/utils/http"
import {decode, encode} from 'js-base64'

/**
 * 提交登录
 * @param model 登录信息模型
 */
export function requestLogin(model: Record<string, any>): Promise<HttpResponse> {
    return http.post(
        '/login',
        model
    ).then((response) => {
        const body = response.data
        return {
            success: response.isOk,
            message: body.message,
            data: body.data
        }
    })
}

/**
 * 获取用户信息
 */
export function fetchProfile(): Promise<HttpResponse> {
    return http.post(
        '/user/info'
    ).then((response) => {
        const body = response.data
        return {
            success: response.isOk,
            message: body.message,
            data: body.data
        }
    })
}

/**
 * 写入记住我信息
 * @param remember 是否记住用户名密码
 * @param username 用户名
 * @param password 登录密码
 */
export function writeRemember(remember: boolean, username: string, password: string) {
    localStorage.setItem('remember', JSON.stringify({
        remember,
        username: encode(username),
        password: encode(password)
    }))
}

/**
 * 读取记住我信息
 */
export function readRemember() {
    const data = localStorage.getItem('remember')
    if (data) {
        const result = JSON.parse(data)
        if (result?.username) {
            result.username = decode(result.username)
        }
        if (result?.password) {
            result.password = decode(result.password)
        }
        return result
    }
    return null
}

/**
 * 移除记住我信息
 */
export function removeRemember() {
    localStorage.removeItem('remember')
}
