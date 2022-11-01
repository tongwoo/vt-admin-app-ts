<!--
功能：用于无限菜单的菜单项，父组件用 el-menu 包裹
日期：2021-12-16
-->
<template>
    <el-menu-item v-if="props.item.children === undefined || props.item.children.length === 0" :index="props.item.path">
        <el-icon v-if="props.item.icon" :class="props.item.icon"></el-icon>
        <template #title>
            {{ props.item.name }}
        </template>
    </el-menu-item>
    <el-sub-menu v-else :index="props.item.path">
        <template #title>
            <el-icon v-if="props.item.icon" :class="props.item.icon"></el-icon>
            <span>{{ props.item.name }}</span>
        </template>
        <menu-item v-for="(menu) in props.item.children" :key="menu.name" :item="menu"></menu-item>
    </el-sub-menu>
</template>

<script lang="ts" setup>
import {MenuItem as MenuItemObject} from "@/types/built-in"

const props = defineProps<{
    item: MenuItemObject
}>()
</script>
