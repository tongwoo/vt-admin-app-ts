<script setup lang="ts">
import {computed, nextTick, onMounted, reactive, ref, Ref, watch} from 'vue'
import {Point} from './kanban'
import {log} from '@/utils/console'

//属性
const props = withDefaults(defineProps<{
    //是否显示工具栏
    showToolbar?: boolean,
    //是否只有在事件目标为board或者view的时候才进行拖动
    direct?: boolean,
    //在刚开始渲染视图后是否让所有子元素出现在画面中
    fit?: boolean,
}>(), {
    showToolbar: true,
    direct: true,
    fit: true,
})

onMounted(() => {
    const boardRect = board.value!.getBoundingClientRect()
    const viewRect = view.value!.getBoundingClientRect()

    const scale = Math.min(viewRect.width / boardRect.width, viewRect.height / boardRect.height)
    //scaleFromPoint({
    //    x: boardRect.width / 2,
    //    y: boardRect.height / 2
    //}, scale > 1 ? -scale : scale)
})

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

/**
 * 鼠标按下
 */
const onBoardMouseDown = (event: MouseEvent) => {
    if (props.direct) {
        if (event.target !== board.value! && event.target !== view.value!) {
            return
        }
    }
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
    renderViewStyle()
}

/**
 * 渲染view样式，此处直接操作dom样式是为了解决在使用响应式带来的卡顿问题
 */
const renderViewStyle = () => {
    view.value!.style.transform = `translate(${viewModel.position.x}px,${viewModel.position.y}px) scale(${viewModel.scale})`
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
    scaleFromPoint(
        {
            x: event.pageX,
            y: event.pageY,
        },
        event.deltaY > 0 ? 0.1 : -0.1
    )
}

/**
 * 丛指定位置进行缩放
 */
const scaleFromPoint = (point: Point, scale: number) => {
    const boardRect = board.value!.getBoundingClientRect()
    const viewRect = view.value!.getBoundingClientRect()
    const scaleX = point.x - boardRect.x - viewModel.position.x
    const scaleY = point.y - boardRect.y - viewModel.position.y
    const distanceXRatio = scaleX / viewRect.width
    const distanceYRatio = scaleY / viewRect.height
    viewModel.scale += scale
    if (viewModel.scale > 5) {
        viewModel.scale = 5
    }
    if (viewModel.scale < 0.2) {
        viewModel.scale = 0.2
    }
    renderViewStyle()
    nextTick(() => {
        const viewNewRect = view.value!.getBoundingClientRect()
        viewModel.position.x -= viewNewRect.width * distanceXRatio - scaleX
        viewModel.position.y -= viewNewRect.height * distanceYRatio - scaleY
        renderViewStyle()
    })
}

const isFullScreen = ref(false)

/**
 * 全屏
 */
const onFullScreen = () => {
    isFullScreen.value = !isFullScreen.value
    if (isFullScreen.value) {
        board.value!.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

/**
 * 缩放
 * @param scale 缩放多少(不是缩放至多少)
 */
const zoom = (scale: number) => {
    log(scale)
    const boardRect = board.value!.getBoundingClientRect()
    scaleFromPoint(
        {
            x: boardRect.width / 2,
            y: boardRect.height / 2,
        },
        scale
    )
}

const slider: Ref<HTMLInputElement | undefined> = ref()

watch(
    () => viewModel.scale,
    (scale) => {
        if (props.showToolbar) {
            slider.value!.value = scale.toString()
        }
    }
)
</script>

<template>
    <div ref="board" class="kanban-board" @wheel.stop.prevent="onBoardWheel" @mousedown.stop="onBoardMouseDown">
        <!--工具栏-->
        <div v-if="showToolbar" class="kanban-toolbar">
            <button type="button" @click="zoom(-0.3)">
                <i class="bi bi-dash"></i>
            </button>
            <input ref="slider" type="range" :min="0.1" :max="5" :step="0.1" value="1" @input="zoom(Number($event.target.value)-viewModel.scale)">
            <button type="button" @click="zoom(0.3)">
                <i class="bi bi-plus"></i>
            </button>
            <button type="button" @click="onFullScreen">
                <i class="bi bi-fullscreen"></i>
            </button>
        </div>
        <!--视图-->
        <div ref="view" class="kanban-viewport">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.kanban-board {
    position: absolute;
    inset: 0;
    background: #eee url("./images/gird.svg");
    overflow: hidden;

    .kanban-toolbar {
        position: absolute;
        right: 10px;
        bottom: 10px;
        //transform: translateX(-50%);
        background-color: white;
        border-radius: 3px;
        padding: 8px;
        display: flex;
        gap: 8px;
        box-shadow: 0 0 1px rgb(0, 0, 0, .3), 0 2px 5px rgb(0, 0, 0, .1);
        z-index: 1000;

        button {
            appearance: none;
            border: 0 none;
            cursor: pointer;
            background-color: #eee;
            padding: 6px;
            line-height: 1;
        }

        input[type=range] {
            background: #eeeeee;
            appearance: none;
            height: 5px;
            margin-top: 11px;
            border-radius: 5px;

            &::-webkit-slider-thumb {
                appearance: none;
                background-color: #ccc;
                width: 12px;
                height: 12px;
                border-radius: 10px;
            }
        }
    }
}

.kanban-viewport {
    position: absolute;
    inset: 0;
    transform-origin: 0 0;
    box-sizing: border-box;
    -webkit-backface-visibility: hidden;
}
</style>
