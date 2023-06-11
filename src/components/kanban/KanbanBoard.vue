<script setup lang="ts">
import {computed, nextTick, onMounted, reactive, ref, Ref} from 'vue'
import {Point} from './kanban'
import {log} from '@/utils/console'

const board: Ref<HTMLDivElement | undefined> = ref()
const boardModel = reactive({
    //位置
    position: {
        x: 0,
        y: 0
    },
    //拖动距离
    distance: {
        x: 0,
        y: 0
    }
})
const view: Ref<HTMLDivElement | undefined> = ref()
const viewModel: {
    position: Point,
    scale: number
} = reactive({
    position: {
        x: 0,
        y: 0,
    },
    scale: 1
})

const viewportStyle = computed(() => {
    const x = (viewModel.position.x * viewModel.scale - viewModel.position.x) / 2
    const y = (viewModel.position.y * viewModel.scale - viewModel.position.y) / 2
    return {
        transform: `translate(${viewModel.position.x}px,${viewModel.position.y}px) scale(${viewModel.scale})`
    }
})

/**
 * 鼠标按下
 */
const onBoardMouseDown = (event: MouseEvent) => {
    boardModel.distance.x = event.pageX - viewModel.position.x
    boardModel.distance.y = event.pageY - viewModel.position.y
    document.addEventListener('mousemove', onDocumentMouseMove)
    document.addEventListener('mouseup', onDocumentMouseUp)
}

/**
 * 鼠标移动
 */
const onDocumentMouseMove = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    viewModel.position.x = event.pageX - boardModel.distance.x
    viewModel.position.y = event.pageY - boardModel.distance.y
}

/**
 * 鼠标松开
 */
const onDocumentMouseUp = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    document.removeEventListener('mousemove', onDocumentMouseMove)
    document.removeEventListener('mouseup', onDocumentMouseUp)
}

/**
 * 鼠标滚轮滚动
 */
const onBoardWheel = (event: WheelEvent) => {
    const boardRect = board.value!.getBoundingClientRect()
    const viewRect = view.value!.getBoundingClientRect()
    const scaleX = event.pageX - boardRect.x - viewModel.position.x
    const scaleY = event.pageY - boardRect.y - viewModel.position.y
    const distanceXRatio = scaleX / viewRect.width
    const distanceYRatio = scaleY / viewRect.height
    const scaleWeight = .05
    if (event.deltaY >= 0) {
        viewModel.scale += scaleWeight
        if (viewModel.scale > 3) {
            viewModel.scale = 3
        }
    } else {
        viewModel.scale -= scaleWeight
        if (viewModel.scale < 0.2) {
            viewModel.scale = 0.2
        }
    }
    nextTick(() => {
        const viewNewRect = view.value!.getBoundingClientRect()
        viewModel.position.x -= viewNewRect.width * distanceXRatio - scaleX
        viewModel.position.y -= viewNewRect.height * distanceYRatio - scaleY
    })

}

onMounted(() => {
})
</script>

<template>
    <div ref="board" class="kanban-board" @wheel.stop.prevent="onBoardWheel" @mousedown.stop.prevent="onBoardMouseDown">
        <div ref="view" class="kanban-viewport" :style="viewportStyle">
            <slot></slot>
        </div>
        <div class="interactive-layer"></div>
    </div>
</template>

<style scoped lang="scss">
.kanban-board {
    position: absolute;
    inset: 0;
    background: #eee url("./images/gird.svg");
    overflow: hidden;
}

.kanban-viewport {
    position: absolute;
    inset: 0;
    overflow: hidden;
    transform-origin: 0 0;
    box-sizing: border-box;
}
</style>
