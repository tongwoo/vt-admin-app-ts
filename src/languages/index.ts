import {createI18n} from 'vue-i18n'
import zhCN from './zh-CN/index'
import enUS from './en-US/index'

const i18n = createI18n({
    locale: 'zh-CN',
    fallbackLocale: 'zh-CN',
    messages: {
        'en-US': enUS.message,
        'zh-CN': zhCN.message
    }
})

export default i18n
