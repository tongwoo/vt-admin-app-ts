import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title: string,
        auth?: boolean,
        permission?: string,
    }

    interface RawRouteComponent {
        __name?: string
    }
}
