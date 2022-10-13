import BaseLayout from "@/views/layouts/BaseLayout.vue"

export default [
    {
        path: '/',
        redirect: '/dashboard',
        component: BaseLayout,
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/Dashboard.vue'),
                meta: {
                    title: '仪表盘',
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
                component: () => import('@/views/user/UserList.vue'),
                meta: {
                    title: '用户管理'
                }
            },
            /*
            {
                path: 'role',
                component: () => import('@/views/role/RoleList.vue'),
                meta: {
                    title: '角色管理'
                }
            },
            {
                path: 'permission',
                component: () => import('@/views/permission/PermissionList.vue'),
                meta: {
                    title: '权限管理'
                }
            },
            {
                path: 'route',
                component: () => import('@/views/route/RouteList.vue'),
                meta: {
                    title: '后台路由'
                }
            }*/
        ]
    }
]
