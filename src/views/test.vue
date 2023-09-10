<template>
    <div>
        <optional-text is-jump :model-value="123.12389" :jump-option="{decimalPlaces:3}"></optional-text>
    </div>
</template>

<script lang="ts" setup>

import OptionalText from '@/components/optional-text.vue'
</script>

<style lang="scss" scoped>

</style>
