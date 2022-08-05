<template>
    <div class="home">
    </div>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import {http} from "@/utils/http";
import {httpErrorHandler} from "@/utils/error";
import {useStore} from "@/store"

const store = useStore()
store.commit('user/UPDATE')
console.info(store.state.user.nickname)

//console.info(store.state.user.permissions)
</script>
