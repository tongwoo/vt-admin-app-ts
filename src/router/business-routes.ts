import BaseLayout from "@/views/layouts/base/base-layout.vue"
import {RouteRecordRaw} from "vue-router"

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
        component: BaseLayout,
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard.vue'),
                meta: {
                    title: '仪表盘',
                    cache: true,
                    auth: false,
                    permission: null
                }
            }
        ]
    },
    {
        path: '/example',
        component: BaseLayout,
        meta: {
            title: '示例'
        },
        children: [
            {
                path: 'i18n',
                component: () => import('@/views/example/i18n.vue'),
                meta: {
                    title: '多语言'
                }
            },
            {
                path: 'chart',
                component: () => import('@/views/example/chart-guide.vue'),
                meta: {
                    title: '图表示例',
                    cache: true
                }
            }
        ]
    },
    {
        path: '/setting',
        component: BaseLayout,
        redirect: '/setting/user',
        meta: {
            title: '系统设置'
        },
        children: [
            {
                path: 'user',
                component: () => import('@/views/user/user-list.vue'),
                meta: {
                    title: '用户管理',
                    auth: true,
                    permission: null
                }
            },
            {
                path: 'role',
                component: () => import('@/views/role/role-list.vue'),
                meta: {
                    title: '角色管理',
                    auth: true,
                    permission: null
                }
            },
            {
                path: 'permission',
                component: () => import('@/views/permission/permission-list.vue'),
                meta: {
                    title: '权限管理',
                    auth: true,
                    permission: null
                }
            },
            {
                path: 'route',
                component: () => import('@/views/route/route-list.vue'),
                meta: {
                    title: '后台路由',
                    auth: true,
                    permission: null
                }
            }
        ]
    }
]

export default routes
