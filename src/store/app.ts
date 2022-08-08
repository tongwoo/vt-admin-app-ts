import i18n from "@/languages/index"
import {RootState} from "@/store/types"
import {AppState} from "@/store/types"
import {Module} from "vuex"

const module: Module<AppState, RootState> = {
    namespaced: true,
    state() {
        return {
            //语言
            language: 'zh-CN',
            //导航器
            navigator: {
                //是否折叠
                collapse: false,
                //页面小于多少宽度折叠菜单
                size: 1366,
                //导航宽度
                width: {
                    //当前宽度
                    current: 236,
                    //最大宽度
                    max: 350,
                    //最小宽度
                    min: 236
                }
            }
        }
    },
    mutations: {
        /**
         * 切换导航菜单
         * @param state 状态
         * @param collapse 是否折叠
         */
        toggleNavigator(state: AppState, collapse: boolean | null = null) {
            if (collapse === null) {
                state.navigator.collapse = !state.navigator.collapse
            } else {
                state.navigator.collapse = collapse
            }
        },
        /**
         * 更新宽度
         * @param state
         * @param width 宽度
         */
        updateWidth(state: AppState, width: number) {
            state.navigator.width.current = width
        },
        /**
         * 更新语言
         * @param state
         * @param lang 语言
         */
        updateLanguage(state: AppState, lang: "zh-CN" | "en-US") {
            i18n.global.locale = state.language = lang
        }
    }
}

export default module
