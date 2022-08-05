<template>
    <div>
        用户管理

    </div>
</template>

<script lang="ts" setup>
import {computed, defineEmits, onMounted, Ref, ref} from "vue";


const count = ref(0)

// 推导得到的类型：ComputedRef<number>
const double = computed<number>(() => count.value * 2)
</script>

<style scoped>

</style>
