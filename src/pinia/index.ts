import {createPinia, defineStore, PiniaPluginContext} from 'pinia'
import {reactive, Ref, ref, watch} from 'vue'
import i18n from '@/languages'

export const pinia = createPinia()

/**
 * 持久化保存store到localStorage
 */
export function permanentStore(context: PiniaPluginContext) {
    debugger
    context.store.$subscribe((mutation, state) => {
        localStorage.setItem(mutation.storeId, JSON.stringify(state))
    })

    const restore = () => {

    }

    return {
        restore,
    }
}

pinia.use(permanentStore)

/**
 * 应用store
 */
export const useAppStore = defineStore('app', () => {
    //语言
    const language = ref('zh-CN')
    //导航
    const navigator = reactive({
        //是否折叠
        collapse: false,
        //页面小于多少宽度折叠菜单
        size: 1366,
    })
    //本地数据是否已经同步
    const synced = ref(false)
    //消息
    const message = reactive({
        //未读数
        unread: 0,
        //总数
        total: 0,
    })
    //缓存组件名列表
    const components: Ref<string[]> = ref([])

    //检查语言并更新
    watch(language, (lang) => {
        i18n.global.locale.value = lang as 'zh-CN' | 'en-US'
    })

    return {
        language,
        navigator,
        synced,
        message,
        components,
    }
})

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
        permissions,
    }
})
