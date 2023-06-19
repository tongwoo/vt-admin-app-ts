<script setup lang="ts">

import Kanban from '@/components/kanban/Kanban.vue'

const items = [...new Array(112)].map(() => {
    const r = Math.ceil(Math.random() * 254)
    const g = Math.ceil(Math.random() * 254)
    const b = Math.ceil(Math.random() * 254)
    const color = `rgb(${r},${g},${b})`
    return {
        color,
        opacity: Math.random(),
        width: Math.ceil(Math.random() * (500 - 100)) + 100,
        height: Math.ceil(Math.random() * (500 - 100)) + 100,
        x: Math.ceil(Math.random() * (1500 - -1500)) + -1500,
        y: Math.ceil(Math.random() * (1200 - -1500)) + -1500,
    }
})
</script>

<template>
    <div class="a">
        <kanban :show-toolbar="true">
            <div class="lay" v-for="(item,i) in items" :key="i"
                 :style="{background: 'red',width: item.width+'px',height: item.height+'px',position: 'absolute',left: item.x+'px',top: item.y+'px',opacity:item.opacity,backgroundColor:item.color}"></div>
                <!--<div data-v-2fde8394="" class="lay"-->
                <!--     style="background: rgb(154, 91, 163); width: 600px; height: 600px; position: absolute; left: -400px; top: 100px; opacity: 0.738242;"></div>-->
                <!--<div data-v-2fde8394="" class="lay"-->
                <!--     style="background: rgb(101, 216, 72); width: 400px; height: 400px; position: absolute; left: 700px; top: 400px; opacity: 0.678759;"></div>-->
        </kanban>
        <div class="s"></div>
    </div>
</template>

<style scoped lang="scss">
.a {
    width: 900px;
    height: 600px;
    position: absolute;
    top: 100px;
    left: 200px;
}
.s{
    width: 2px;
    background-color: red;
    position:absolute;
    top:0;
    bottom:0;
    left:50%;
}
.lay {
    border: 1px solid #000;
    box-sizing: border-box;
}
</style>
