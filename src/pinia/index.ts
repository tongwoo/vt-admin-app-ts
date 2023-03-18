import {createPinia, defineStore, PiniaPluginContext} from 'pinia'
import {Ref, ref, toRaw, watch} from 'vue'
import i18n from '@/languages'

export const pinia = createPinia()

/**
 * Pinia插件 - 持久化保存store到localStorage以及自动恢复
 */
pinia.use((context: PiniaPluginContext) => {
    const backup = localStorage.getItem(context.store.$id)
    const data = backup ? JSON.parse(backup) : {}
    context.store.$subscribe((mutation, state) => {
        localStorage.setItem(mutation.storeId, JSON.stringify(state))
    })
    return {
        ...data
    }
})

/**
 * 导航
 */
interface Navigator {
    //是否折叠
    collapse: boolean,
    //页面小于多少宽度折叠菜单
    size: number
}

/**
 * 消息
 */
interface Message {
    //未读数
    unread: number,
    //总数
    total: number,
    //消息列表
    items: Array<{ id: string | number, title: string, time: string }>
}

/**
 * 应用store
 */
export const useAppStore = defineStore('app', () => {
    //语言
    const language = ref('zh-CN')
    //导航
    const navigator: Ref<Navigator> = ref({
        collapse: false,
        size: 1366
    })
    //消息
    const message: Ref<Message> = ref({
        unread: 0,
        total: 0,
        items: []
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
        message,
        components
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
        permissions
    }
})
