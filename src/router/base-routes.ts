import NoneLayout from "@/views/layouts/none-layout.vue"
import {RouteRecordRaw} from "vue-router"

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        component: () => import('@/views/login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/error',
        component: NoneLayout,
        meta: {
            title: '异常'
        },
        children: [
            {
                path: 'forbidden',
                component: () => import('@/views/error/forbidden.vue'),
                meta: {
                    title: '无权限'
                }
            },
            {
                path: 'not-found',
                component: () => import('@/views/error/not-found.vue'),
                meta: {
                    title: '页面不存在'
                }
            }
        ]
    }
]

export default routes
