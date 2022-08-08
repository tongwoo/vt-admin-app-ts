import {updateObject} from "@/utils/object"
import {Module} from "vuex"
import {RootState, UserState} from "@/store/types"

/**
 * 用户模块
 */
const module: Module<UserState, RootState> = {
    namespaced: true,
    state() {
        return {
            //授权数据
            authorization: null,
            //昵称
            nickname: null,
            //头像(可直接访问的图片地址)
            avatar: null,
            //此用户拥有的权限列表
            permissions: []
        }
    },
    mutations: {
        /**
         * 更新用户信息
         */
        update(state: UserState, payload: object) {
            updateObject(state, payload)
        }
    }
}

export default module
