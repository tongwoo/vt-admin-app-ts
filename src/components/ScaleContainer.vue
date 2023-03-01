<!--
功能：缩放容器
日期：2022-05-20
说明：放入此组件
-->
<template>
    <div class="scale-container" ref="container" @wheel="wheel" :style="style" @mousedown="mouseDown">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, onUnmounted, reactive, computed} from 'vue'

//容器
const container = ref<HTMLElement>()

//监听器
let observer: ResizeObserver | undefined

//属性
const props = withDefaults(defineProps<{
    //内容宽度
    width: number,
    //内容高度
    height: number,
    //缩放到多少，默认为1，即缩放到容器尺寸的100%
    percent?: number
    //是否允许拖动
    allowDrag?: boolean,
    //是否允许滚轮缩放
    allowZoom?: boolean
}>(), {
    percent: 1,
    allowDrag: false,
    allowZoom: false,
})

const scale = ref(1)

const style = computed(() => {
    const properties = {
        left: position.x + 'px',
        top: position.y + 'px',
        transform: 'scale(1)',
    }
    if (scale.value < 1) {
        properties.transform = `scale(${scale.value})`
    }
    return properties
})

onMounted(() => {
    const parent = container.value!.parentElement
    if (!parent) {
        return
    }
    observer = new ResizeObserver(() => {
        const width = parent.clientWidth / props.width
        const height = parent.clientHeight / props.height
        scale.value = Math.min(width, height) * props.percent
        position.x = 0
        position.y = 0
    })
    observer.observe(parent)
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})

/**
 * 鼠标滚轮滚动
 */
const wheel = (e: WheelEvent) => {
    e.preventDefault()
    if (!props.allowZoom) {
        return
    }
    if (e.deltaY > 0) {
        scale.value += 0.1
    } else {
        scale.value -= 0.1
    }
    if (scale.value < 0.1) {
        scale.value = 0.1
    } else if (scale.value > 1) {
        scale.value = 1
    }
}

//位置
const position = reactive({
    x: 0,
    y: 0,
})

//拖动距离
const distance = reactive({
    x: 0,
    y: 0,
})

/**
 * 鼠标按下
 */
const mouseDown = (e: MouseEvent) => {
    e.preventDefault()
    if (!props.allowDrag) {
        return
    }
    distance.x = e.pageX - position.x
    distance.y = e.pageY - position.y
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', documentMouseMove)
    document.addEventListener('mouseup', documentMouseUp)
}

/**
 * 鼠标移动
 */
const documentMouseMove = (e: MouseEvent) => {
    e.stopPropagation()
    position.x = e.pageX - distance.x
    position.y = e.pageY - distance.y
}

/**
 * 鼠标松开
 */
const documentMouseUp = (e: MouseEvent) => {
    e.stopPropagation()
    document.body.style.removeProperty('user-select')
    document.removeEventListener('mousemove', documentMouseMove)
    document.removeEventListener('mouseup', documentMouseUp)
}

</script>

<style lang="scss" scoped>
.scale-container {
    transition: transform .3s;
    transform-origin: center center;
    user-select: none;
}
</style>
