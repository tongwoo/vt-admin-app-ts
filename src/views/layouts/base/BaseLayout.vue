<!--
功能：基本布局
日期：2021-12-06
-->
<template>
    <div ref="baseLayout" class="base-layout" :class="navigatorShow ? null : 'base-layout-collapse'">
        <!--头部-->
        <base-header></base-header>
        <!--左侧导航-->
        <base-navigator></base-navigator>
        <!--路由Tab切换-->
        <div class="route-tab-bar">
            <route-switcher></route-switcher>
        </div>
        <div class="base-content">
            <router-view v-slot="{ Component, route }">
                <transition name="el-fade-in" mode="out-in">
                    <keep-alive :include="keepAliveComponents">
                        <component ref="viewComponent" v-if="!reload" :is="Component" :key="route.path"></component>
                    </keep-alive>
                </transition>
            </router-view>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, Ref, ref} from 'vue'
import {useRoute} from 'vue-router'
import mitter from '@/utils/mitter'
import RouteSwitcher from '@/components/RouteSwitcher.vue'
import {useAppStore} from '@/pinia/app'

//顶栏
const BaseHeader = defineAsyncComponent(() => import('./BaseHeader.vue'))
//侧边栏导航
const BaseNavigator = defineAsyncComponent(() => import('./BaseNavigator.vue'))

const appStore = useAppStore()
const route = useRoute()

//当前路由对应的组件
const viewComponent = ref(null)

/**
 * 导航菜单是否显示
 */
const navigatorShow = computed(() => {
    return !appStore.navigator.collapse
})

/**
 * 要缓存的组件名称列表，前提是路由 meta 中存在 cache
 */
const keepAliveComponents = computed(() => {
    return appStore.components
})

//检测布局大小设置菜单的显示
const baseLayout: Ref = ref(null)
let observer: ResizeObserver
onMounted(() => {
    observer = new ResizeObserver(() => {
        if (baseLayout.value.clientWidth <= appStore.navigator.size) {
            appStore.$patch((state) => {
                state.navigator.collapse = true
            })
        }
    })
    observer.observe(baseLayout.value)
})
onUnmounted(() => {
    observer.disconnect()
})

//页面刷新处理
const reload: Ref = ref(false)
onMounted(() => {
    mitter.on('page-refresh', () => {
        if (route.matched.length > 0) {
            const name = ((route.matched[route.matched.length - 1].components?.default) as any).__name
            appStore.$patch((state) => {
                const index = state.components.indexOf(name)
                if (index !== -1) {
                    state.components.splice(index, 1)
                }
            })
            reload.value = true
            nextTick(() => {
                reload.value = false
                if (route?.meta?.cache) {
                    appStore.$patch((state) => {
                        if (state.components.indexOf(name) === -1) {
                            state.components.push(name)
                        }
                    })
                }
            })
        }
    })
})
onUnmounted(() => {
    mitter.off('page-refresh')
})
</script>

<style lang="scss" scoped>
.base-layout {
    min-height: 100vh;
    background-color: #f4f5f7;

    &.base-layout-collapse {
        .route-tab-bar {
            left: var(--base-navigator-collapse-width);
        }

        .base-content {
            padding-left: var(--base-navigator-collapse-width);
        }
    }

    .route-tab-bar {
        position: fixed;
        top: var(--base-header-height);
        left: var(--base-navigator-width);
        right: 0;
        transition: all .3s;
        z-index: 10;
    }

    .base-content {
        padding-left: var(--base-navigator-width);;
        padding-top: calc(var(--base-header-height) + 39px);
        transition: all .3s;
    }

    .water-mask {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2000;
        pointer-events: none;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;

        > ul {
            display: flex;
            gap: 120px;
            flex-wrap: wrap;

            > li {
                color: rgba(59, 34, 34, 0.1);
                font-size: 14px;
                font-weight: bold;
                transform: rotateZ(-45deg);
            }
        }
    }
}
</style>
