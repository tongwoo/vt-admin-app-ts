import {InjectionKey} from 'vue'
import {createStore, Store, useStore as _useStore} from 'vuex'
import {GlobalState, RootState} from "@/store/types"
import user from "@/store/user"
import app from "@/store/app"
import keepalive from "@/store/keepalive"

/**
 * Store的Key
 */
export const key: InjectionKey<Store<RootState>> = Symbol()

/**
 * Store实例
 */
export const store = createStore<RootState>({
    state: {
        //本地数据是否已经同步
        synced: false,
        //消息
        message: {
            //未读数
            unread: 0,
            //总数
            total: 0
        }
    },
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        user,
        app,
        keepalive
    }
})

/**
 * Setup方式使用此方法应用Store实例
 */
export function useStore<S = GlobalState>() {
    return _useStore<S>(key)
}
