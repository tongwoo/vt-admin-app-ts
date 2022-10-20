import {http, HttpResponse} from "@/utils/http"

export interface LoginModel {
    username: string | null,
    password: string | null,
    captcha?: string | null
}

/**
 * 提交登录
 * @param model 登录信息模型
 */
export function requestLogin(model: LoginModel): Promise<HttpResponse> {
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
