<template>
    <router-view v-slot="{ Component, route }">
        <component :is="Component"></component>
    </router-view>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>

</style>
