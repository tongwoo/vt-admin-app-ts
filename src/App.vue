<template>
    <el-config-provider :locale="locale">
        <router-view></router-view>
    </el-config-provider>
</template>
<script lang="ts" setup>
import {useStore} from "@/store/index"
import {computed, onMounted} from "vue"
import zhCN from "element-plus/es/locale/lang/zh-cn"
import enUS from "element-plus/es/locale/lang/en"

const store = useStore()

//使用哪种语言，默认导入了中文和英文
const locale = computed(() => {
    const language = store.state.app.language
    if (language === 'en-US') {
        return enUS
    }
    return zhCN
})

onMounted(() => {
    //移除加载元素
    const loadElement = document.querySelector('.loading-mask')
    if (loadElement instanceof Element) {
        document.body.removeChild(loadElement)
    }
})
</script>
