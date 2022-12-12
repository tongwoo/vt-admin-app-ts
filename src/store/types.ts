/**
 * 根状态
 */
export interface RootState {
    synced: boolean,
    message: {
        unread: number,
        total: number
    }
}

/**
 * 用户状态
 */
export interface UserState {
    authorization: string | null,
    nickname: string | null,
    avatar: string | null,
    permissions: Array<string | number>
}

/**
 * 应用设置
 */
export interface AppState {
    language: string,
    navigator: {
        collapse: boolean,
        size: number,
    }
}

/**
 * 组件状态
 */
export interface KeepAliveState {
    //要缓存的组件名称列表
    componentNames: string[]
}

/**
 * 全局状态
 */
export interface GlobalState extends RootState {
    app: AppState,
    user: UserState,
    keepalive: KeepAliveState,
}
