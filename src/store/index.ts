import {InjectionKey} from 'vue'
import {createStore, Store, useStore as _useStore} from 'vuex'
import {GlobalState, RootState} from "@/store/types"
import user from "@/store/user"


export const key: InjectionKey<Store<RootState>> = Symbol()

export const store = createStore<RootState>({
    state: {
        //本地数据是否已经同步
        synced: false,
        count: 1
    },
    getters: {},
    mutations: {
        changePassword(state, payload) {
            state.count = payload
            //state.user.permissions = []
        }
    },
    actions: {},
    modules: {
        user
    }
})

export function useStore<S = GlobalState>() {
    return _useStore<S>(key)
}
