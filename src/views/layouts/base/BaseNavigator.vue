<!-- 菜单导航 -->
<template>
    <div class="base-navigator" :class="isCollapsed ? 'base-navigator-collapse' : null">
        <!--用户面板-->
        <div class="user-panel">
            <div v-if="userStore.avatar" class="user-logo">
                <img :src="userStore.avatar" @error="onAvatarError">
            </div>
            <div class="user-name" v-show="!isCollapsed">
                {{ userStore.nickname }}
            </div>
        </div>
        <!--菜单-->
        <el-scrollbar>
            <el-menu :router="true" :unique-opened="true" :collapse="isCollapsed" :collapse-transition="false" :default-active="route.path">
                <template v-for="menu in menus" :key="menu.name">
                    <menu-item v-if="menu.show" :item="menu"></menu-item>
                </template>
            </el-menu>
        </el-scrollbar>
        <!--折叠-->
        <div class="collapse-button" @click="onNavigatorBtnClick">
            <transition name="el-fade-in" mode="out-in">
                <span v-if="isCollapsed"><i class="bi bi-chevron-double-right"></i></span>
                <span v-else><i class="bi bi-chevron-double-left"></i>收起侧边栏</span>
            </transition>
        </div>
    </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import MenuItem from '@/components/MenuItem.vue'
import {useRoute} from 'vue-router'
import defaultAvatar from '@/assets/images/icons/avatar-default.png'
import {filterAuthMenus, navigateMenus} from '@/data/menu'
import {useUserStore} from '@/pinia/user'
import {useAppStore} from '@/pinia/app'

const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()

//菜单列表
const menus = filterAuthMenus(navigateMenus)

//菜单是否折叠
const isCollapsed = computed(() => {
    return appStore.navigator.collapse
})

/**
 * 头像加载失败
 */
const onAvatarError = (error) => {
    error.target.src = defaultAvatar
}

/**
 * 导航切换按钮点击
 */
const onNavigatorBtnClick = () => {
    appStore.navigator.collapse = !appStore.navigator.collapse
}
</script>

<style lang="scss" scoped>
.base-navigator {
    position: fixed;
    top: var(--base-header-height);
    left: 0;
    bottom: 0;
    width: var(--base-navigator-width);
    background-color: var(--base-navigator-bg-color);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all .3s;
    box-shadow: 1px 2px 5px rgba(0, 0, 0, .06);
    z-index: 1001;
    user-select: none;

    &.base-navigator-collapse {
        width: var(--base-navigator-collapse-width);

        :deep(.el-menu) {
            --el-menu-base-level-padding: 20px;
        }
    }

    .collapse-bar {
        text-align: center;
    }

    :deep(.el-menu) {
        --el-menu-base-level-padding: 35px;
        border-right: 0 none;

        .is-active {
            //background-color: black;
        }
    }

    :deep(.el-menu) {
        --el-menu-bg-color: 'white'
    }

    .navigator-drag {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 5px;
        z-index: 1100;
        cursor: ew-resize;
    }

    .collapse-button {
        cursor: pointer;
        user-select: none;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 15px 20px;
        color: rgba(255, 255, 255, 0.78);
        font-size: 14px;
        white-space: nowrap;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        .bi {
            margin-right: 5px;
        }
    }
}

.user-panel {
    padding: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .user-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all .3s;

        img {
            max-width: 70px;
            border-radius: 50%;
            width: 100%;
            border: 1px solid rgba(0, 0, 0, 0.5);
            box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.5);
            box-sizing: border-box;
        }

        &.user-logo-collapse {
            img {
                width: 0;
            }
        }
    }

    .user-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        font-size: 14px;
        color: #5198F8;
        margin-top: 20px;
    }

}
</style>
