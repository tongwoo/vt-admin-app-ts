<script setup lang="ts">

import Kanban from "@/components/kanban/Kanban.vue";
import ChangePassword from '@/views/ChangePassword.vue'
import Login from '@/views/Login.vue'
</script>

<template>
    <kanban>
        <el-button type="primary" v-for="(item,i) in 2000" :key="i">测试</el-button>
    </kanban>
</template>

<style scoped lang="scss">

</style>
