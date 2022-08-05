import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserList from '../views/user/UserList.vue'
import setting from "@/setting"

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: UserList,
                children: [
                    {
                        path: 'dashboard',
                        name: 'dashboard',
                        component: UserList
                    }
                ]
            }
        ]
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

/**
 * 路由是否存在
 */
router.beforeEach((to, from) => {
    if (to.matched.length === 0) {
        return {
            path: '/error/not-found'
        }
    }
    return true
})

/**
 * 是否有权限
 */
router.beforeEach((to, from) => {
    //配置中是否启用了认证功能
    if (!setting.auth.enable) {
        return true
    }
    //访问的路由是否需要认证检测
    if (!to.meta?.auth) {
        return true
    }

    //如果本地没有认证信息则跳转到登录页面

    //访问的路由是否需要权限监测，如需要则检查本地是否有匹配的权限
    if (to.meta?.permission !== undefined) {

    }


    return true
})
console.info(router.getRoutes())
export default router
