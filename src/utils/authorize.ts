import {useStore} from "@/store/index"
import setting from "@/setting"
import jsCookie from "js-cookie"
import {RouteLocationNormalized, RouteRecord, RouteRecordNormalized, RouteRecordRaw} from "vue-router"

/**
 * 授权名称，根据设置存储到cookie或者localStorage中的字段名称
 * @type {string}
 */
const AUTHORIZATION_NAME = 'authorization'

/**
 * 在嵌套路由集合中检测指定的路由是否存在
 * @param {Array} routes 路由集合，遍历规则为 节点->子孙节点 - 节点N->子孙节点
 * @param {Object} targetRoute 要检测的路由对象，或至少包含fullPath属性的对象
 * @param {Object} parent 父路由
 * @return {boolean}
 */
function routeExists(routes: Array<RouteRecordNormalized | RouteRecordRaw>, targetRoute: RouteLocationNormalized, parent: RouteRecordNormalized | RouteRecordRaw | undefined) {
    for (const route of routes) {
        const path = parent !== undefined ? parent.path + '/' + route.path : route.path
        if (path === targetRoute.path) {
            return true
        }
        if (route.children!.length > 0) {
            const exists = routeExists(route.children!, targetRoute, route)
            if (exists) {
                return true
            }
        }
    }
    return false
}

/**
 * 检测访问权限
 * @param {string|int} permission 待检测的权限
 * @return {boolean} 有权限=true 无权限=false
 */
function checkAccess(permission: string | undefined) {
    if (permission === '' || permission === undefined) {
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
function readAuthorization() {
    let authorization = null
    if (setting.auth.storage === 'localstorage') {
        authorization = window.localStorage.getItem(AUTHORIZATION_NAME)
    } else if (setting.auth.storage === 'cookie') {
        authorization = jsCookie.get(AUTHORIZATION_NAME)
    }
    return authorization ?? null
}

/**
 * 设置授权信息到客户端存储
 * @param authorization 授权数据
 */
function writeAuthorization(authorization: string) {
    //根据配置将授权数据存放到不同的位置
    if (setting.auth.storage === 'localstorage') {
        window.localStorage.setItem(AUTHORIZATION_NAME, authorization)
    } else if (setting.auth.storage === 'cookie') {
        jsCookie.set(AUTHORIZATION_NAME, authorization, {
            path: '/'
        })
    }
}

/**
 * 清空授权信息
 */
function cleanAuthorization() {
    window.localStorage.removeItem(AUTHORIZATION_NAME)
    jsCookie.remove(AUTHORIZATION_NAME, {
        path: '/'
    })
}

export {
    routeExists,
    checkAccess,
    readAuthorization,
    writeAuthorization,
    cleanAuthorization
}
