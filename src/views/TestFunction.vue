<template>
    <div>
        <button type="button" @click="handler">debounce</button>
        <button type="button" @click="destroy">remove</button>
    </div>
</template>

<script lang="ts" setup>

import {debounce} from "@/utils/task"

/**
 * click
 */
const c = (e:any) => {
    console.info(e)
};

const {destroy,handler} = debounce(c, 2000)
</script>

<style scoped>

</style>
