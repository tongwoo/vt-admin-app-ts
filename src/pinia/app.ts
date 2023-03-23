import i18n from "@/languages/index"
import {defineStore} from "pinia"
import {Ref, ref, watch} from "vue"

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
