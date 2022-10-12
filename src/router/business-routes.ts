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
    }
]
