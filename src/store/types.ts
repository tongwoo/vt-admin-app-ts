/**
 * 跟状态
 */
export interface RootState {
    synced: boolean,
    count: number
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
 * 全局状态
 */
export interface GlobalState extends RootState {
    user: UserState
}
