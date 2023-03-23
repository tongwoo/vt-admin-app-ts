import {defineStore} from "pinia"
import {ref, Ref} from "vue"

/**
 * 用户store
 */
export const useUserStore = defineStore('user', () => {
    //授权数据
    const authorization: Ref<string | null> = ref(null)
    //昵称
    const nickname: Ref<string | null> = ref(null)
    //头像(可直接访问的图片地址)
    const avatar: Ref<string | null> = ref(null)
    //此用户拥有的权限列表
    const permissions: Ref<string[]> = ref([])

    return {
        authorization,
        nickname,
        avatar,
        permissions
    }
})
