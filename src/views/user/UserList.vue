<template>
    <div>
        用户管理

    </div>
</template>
<script lang="ts" setup>
import {onMounted} from "vue"
import {useRoute} from "vue-router"

onMounted(()=>{
    console.info(useRoute().matched)
})
</script>
