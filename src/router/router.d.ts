import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title: string,
        auth?: boolean,
        permission?: string,
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomOptions {
        default: Record<string, never>
    }
}
