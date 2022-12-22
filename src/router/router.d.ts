import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title: string,
        auth?: boolean,
        permission?: string|null,
    }

    interface RouteComponent {
        __name: string
    }
}
