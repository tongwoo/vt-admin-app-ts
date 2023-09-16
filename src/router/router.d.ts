import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        //标题
        title: string,
        //是否需要的呢牢固后才能访问
        auth?: boolean,
        //此路由需要的权限
        permission?: string | null,
    }

    interface RouteComponent {
        __name: string
    }
}
