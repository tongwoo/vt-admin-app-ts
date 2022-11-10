import {AUTH_STORAGE_COOKIE} from "@/constants/auth-storage"
import {AUTH_STORAGE_LOCAL} from "@/constants/auth-storage"
import {useStore} from "@/store/index"
import setting from "@/setting"
import jsCookie from "js-cookie"

/**
 * 授权名称，根据设置存储到cookie或者localStorage中的字段名称
 * @type {string}
 */
const AUTHORIZATION_NAME = 'authorization'

/**
 * 检测访问权限
 * @param {string|int} permission 待检测的权限
 * @return {boolean} 有权限=true 无权限=false
 */
export function checkAccess(permission: string) {
    if (permission === '') {
        return true
    }
    //本地保存的权限
    const permissions = useStore().state.user.permissions
    //如果本地没有则返回无权限
    if (permissions.length === 0) {
        return false
    }
    //是否存在此权限
    const exists = permissions.find((item) => {
        return item === permission
    })
    return exists !== undefined
}

/**
 * 从客户端获取授权信息
 * @return {null|string}
 */
export function readAuthorization() {
    let authorization = null
    if (setting.auth.storage === AUTH_STORAGE_LOCAL) {
        authorization = window.localStorage.getItem(AUTHORIZATION_NAME)
    } else if (setting.auth.storage === AUTH_STORAGE_COOKIE) {
        authorization = jsCookie.get(AUTHORIZATION_NAME)
    }
    return authorization ?? null
}

/**
 * 设置授权信息到客户端存储
 * @param authorization 授权数据
 */
export function writeAuthorization(authorization: string) {
    //根据配置将授权数据存放到不同的位置
    if (setting.auth.storage === AUTH_STORAGE_LOCAL) {
        window.localStorage.setItem(AUTHORIZATION_NAME, authorization)
    } else if (setting.auth.storage === AUTH_STORAGE_COOKIE) {
        jsCookie.set(AUTHORIZATION_NAME, authorization, {
            path: '/'
        })
    }
}

/**
 * 清空授权信息
 */
export function cleanAuthorization() {
    window.localStorage.removeItem(AUTHORIZATION_NAME)
    jsCookie.remove(AUTHORIZATION_NAME, {
        path: '/'
    })
}
