import {KeepAliveState, RootState} from "@/store/types"
import {Module} from "vuex"

const module: Module<KeepAliveState, RootState> = {
    namespaced: true,
    state() {
        return {
            //要缓存的组件名称列表
            componentNames: []
        }
    },
    mutations: {
        /**
         * 添加要缓存的组件
         * @param state
         * @param name 组件名
         */
        add(state: KeepAliveState, name: string) {
            if (state.componentNames.indexOf(name) !== -1) {
                return
            }
            state.componentNames.push(name)
        },
        /**
         * 移除缓存组件
         * @param state
         * @param {string} name 组件名
         */
        remove(state: KeepAliveState, name: string) {
            const index = state.componentNames.indexOf(name)
            if (index !== -1) {
                state.componentNames.splice(index, 1)
            }
        }
    }
}

export default module
