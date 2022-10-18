import i18n from "@/languages/index"
import {readAuthorization} from "@/utils/authorize"
import {updateObject} from "@/utils/object"
import {InjectionKey} from 'vue'
import {createStore, Store, useStore as _useStore} from 'vuex'
import {GlobalState, RootState} from "@/store/types"
import user from "@/store/user"
import app from "@/store/app"
import keepalive from "@/store/keepalive"

/**
 * Store的Key
 */
export const storeKey: InjectionKey<Store<RootState>> = Symbol()

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
    getters: {
        /**
         * 是否登录了
         * @param state
         * @returns {boolean}
         */
        isLogin(state) {
            return (state as GlobalState).user.authorization !== null
        }
    },
    mutations: {
        /**
         * 更新消息未读数
         * @param state
         * @param {int} number 未读数量
         */
        messageUpdateUnread(state, number) {
            state.message.unread = number
        },
        /**
         * 读取本地存储的信息同步到Store
         */
        localSync(state) {
            const gs = state as GlobalState
            //设置为已同步，路由守卫不会再次进行同步处理
            state.synced = true
            //本地信息
            const localData = localStorage.getItem('localStore')
            if (localData === null) {
                return
            }
            const localState = JSON.parse(localData)
            if (localState instanceof Object) {
                updateObject(state, localState)
            }
            //恢复语言设置
            if (gs.app.language !== null) {
                i18n.global.locale = gs.app.language as 'zh-CN'|'en-US'
            }
            //恢复授权信息
            gs.user.authorization = readAuthorization()
        },
        /**
         * 清空
         */
        cleanup(state) {
            const gs = state as GlobalState
            localStorage.removeItem('localStore')
            //用户
            gs.user.authorization = null
            gs.user.nickname = null
            gs.user.avatar = null
            gs.user.permissions = []
            //组件缓存
            gs.keepalive.componentNames = []
        }
    },
    actions: {},
    modules: {
        user,
        app,
        keepalive
    }
})


/**
 * 在每次提交Mutation后保存到localStorage
 */
store.subscribe((mutation, state) => {
    //忽略的Mutation列表，有些Mutation是不需要处理的
    const ignoreMutations = [
        'localSync',
        'cleanup',
    ]
    if (ignoreMutations.indexOf(mutation.type) !== -1) {
        return
    }
    localStorage.setItem('localStore', JSON.stringify(state))
})

/**
 * Setup方式使用此方法应用Store实例
 */
export function useStore<S = GlobalState>() {
    return _useStore<S>(storeKey)
}
