import baseRoutes from '@/router/base-routes'
import businessRoutes from '@/router/business-routes'
import {checkAccess} from '@/utils/authorize'
import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import setting from '@/setting'
import {useUserStore} from '@/pinia/user'
import {useAppStore} from '@/pinia/app'

/**
 * 路由列表
 */
const routes: Array<RouteRecordRaw> = [
    ...baseRoutes,
    ...businessRoutes
]

/**
 * 路由实例
 */
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

/**
 * 前置守卫 - 路由是否存在
 */
router.beforeEach((to) => {
    if (to.matched.length === 0) {
        return {
            path: '/error/not-found'
        }
    }
    return true
})

/**
 * 前置守卫 - 是否有权限
 */
router.beforeEach((to) => {
    //配置中是否启用了认证功能
    if (!setting.auth.enable) {
        return true
    }
    //访问的路由是否需要认证检测
    if (!to.meta?.auth) {
        return true
    }
    //如果本地没有认证信息则跳转到登录页面
    if (useUserStore().authorization === null) {
        return {
            path: '/login'
        }
    }
    //访问的路由是否需要权限监测，如需要则检查本地是否有匹配的权限
    if (to.meta?.permission !== undefined) {
        if (!checkAccess(to.meta.permission)) {
            return {
                path: '/error/forbidden'
            }
        }
    }
    return true
})

//后置守卫 - 缓存组件，检查路由meta是否有cache属性，如果有且为true则进行缓存
router.afterEach((to) => {
    if (to.meta?.cache) {
        const component = to.matched[to.matched.length - 1].components
        if (component) {
            const name = component.default.name ?? (component.default as Record<string, string>).__name
            if (name) {
                const store = useAppStore()
                if (store.components.indexOf(name) === -1) {
                    store.$patch((state) => {
                        state.components.push(name)
                    })
                }
            }
        }
    }
    return true
})

//后置守卫 - 设置页面标题
router.afterEach((to) => {
    if (to.meta?.title !== undefined) {
        document.title = to.meta.title + ' - ' + setting.name
    } else {
        document.title = setting.name
    }
})

export default router
