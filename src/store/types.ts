/**
 * 跟状态
 */
export interface RootState {
    //本地数据是否已经同步
    synced: boolean,
    //消息
    message: {
        //未读数
        unread: number,
        //总数
        total: number
    }
}

/**
 * 用户状态
 */
export interface UserState {
    //授权数据
    authorization: string | null,
    //昵称
    nickname: string | null,
    //头像(可直接访问的图片地址)
    avatar: string | null,
    //此用户拥有的权限列表
    permissions: Array<string | number>
}

/**
 * 应用设置
 */
export interface AppState {
    //语言
    language: string,
    //导航器
    navigator: {
        //是否折叠
        collapse: boolean,
        //页面小于多少宽度折叠菜单
        size: number,
        //导航宽度
        width: {
            //当前宽度
            current: number,
            //最大宽度
            max: number,
            //最小宽度
            min: number
        }
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
