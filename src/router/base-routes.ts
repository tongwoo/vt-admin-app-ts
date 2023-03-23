import BaseLayout from "@/views/layouts/base/BaseLayout.vue"
import {RouteRecordRaw} from "vue-router"

const routes: RouteRecordRaw[] = [
    {
        path: '/test',
        component: () => import('@/views/TestFunction.vue'),
        meta: {
            title: '测试'
        }
    },
    {
        path: '/login',
        component: () => import('@/views/Login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/error',
        component: BaseLayout,
        meta: {
            title: '异常'
        },
        children: [
            {
                path: 'forbidden',
                component: () => import('@/views/error/Forbidden.vue'),
                meta: {
                    title: '无权限'
                }
            },
            {
                path: 'not-found',
                component: () => import('@/views/error/NotFound.vue'),
                meta: {
                    title: '页面不存在'
                }
            }
        ]
    }
]

export default routes
