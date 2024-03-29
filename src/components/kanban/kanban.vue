<template>
    <div ref="boardDom" class="kanban-board" @fullscreenchange="onBoardFullscreenChange" @wheel.stop.prevent="onBoardWheel" @mousedown.stop="onBoardMouseDown">
        <!--工具栏-->
        <div v-if="showToolbar" class="kanban-toolbar" @mousedown.stop>
            <button type="button" @click="zoom(-0.3)" title="缩小">
                <i class="bi bi-dash"></i>
            </button>
            <input ref="slider" type="range" :min="0.1" :max="5" :step="0.01" value="1" @input="zoom(Number($event.target.value)-viewport.scale)">
            <button type="button" @click="zoom(0.3)" title="放大">
                <i class="bi bi-plus"></i>
            </button>
            <button type="button" @click="fullscreen" title="全屏">
                <i class="bi bi-arrows-fullscreen"></i>
            </button>
            <button type="button" @click="fitViewport" title="缩放到合适视野">
                <i class="bi bi-aspect-ratio"></i>
            </button>
        </div>
        <!--视图-->
        <div ref="viewportDom" class="kanban-viewport">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, reactive, ref, Ref, watch} from 'vue'
import {Point} from './kanban'
import {log} from '@/utils/console'

//属性
const props = withDefaults(defineProps<{
    //是否显示工具栏
    showToolbar?: boolean,
    //是否只有在事件目标为board或者view的时候才进行拖动
    direct?: boolean,
    //在刚开始渲染视图后是否自动缩放到合适的视野
    fit?: boolean,
    //是否自动缩放到合适的视野
    autoFit?: boolean,
    //是否自动缩放到合适的视野
    viewDraggable?: boolean,
}>(), {
    showToolbar: true,
    direct: false,
    fit: true,
    autoFit: false,
    viewDraggable: true,
})

const boardDom: Ref<HTMLDivElement | undefined> = ref()
const board = reactive({
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
const viewportDom: Ref<HTMLDivElement | undefined> = ref()
const viewport: {
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
    if (!props.viewDraggable) {
        return
    }
    if (props.direct && event.target !== boardDom.value! && event.target !== viewportDom.value!) {
        return
    }
    board.distance.x = event.pageX - viewport.position.x
    board.distance.y = event.pageY - viewport.position.y
    document.addEventListener('mousemove', onDocumentMouseMove)
    document.addEventListener('mouseup', onDocumentMouseUp)
}

/**
 * 鼠标移动
 */
const onDocumentMouseMove = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    viewport.position.x = event.pageX - board.distance.x
    viewport.position.y = event.pageY - board.distance.y
    renderViewStyle()
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
    const boardRect = boardDom.value!.getBoundingClientRect()
    scaleFromPoint(
        {
            x: event.pageX - boardRect.x,
            y: event.pageY - boardRect.y,
        },
        event.deltaY > 0 ? 0.02 : -0.02
    )
}

/**
 * 渲染view样式，此处直接操作dom样式是为了解决在使用响应式带来的卡顿问题
 */
const renderViewStyle = () => {
    viewportDom.value!.style.transform = `translate(${viewport.position.x}px,${viewport.position.y}px) scale(${viewport.scale})`
}

/**
 * 丛指定位置进行缩放
 * @param point 位置
 * @param scale 缩放多少倍数，整数为放大，负数为缩小
 */
const scaleFromPoint = (point: Point, scale: number) => {
    const boardRect = boardDom.value!.getBoundingClientRect()
    const viewRect = viewportDom.value!.getBoundingClientRect()
    const scaleX = point.x - viewport.position.x
    const scaleY = point.y - viewport.position.y
    const distanceXRatio = scaleX / viewRect.width
    const distanceYRatio = scaleY / viewRect.height
    viewport.scale += scale
    if (viewport.scale > 5) {
        viewport.scale = 5
    }
    if (viewport.scale < 0.2) {
        viewport.scale = 0.2
    }
    //重新渲染一下用于获取最新尺寸
    renderViewStyle()
    nextTick(() => {
        const viewNewRect = viewportDom.value!.getBoundingClientRect()
        viewport.position.x -= viewNewRect.width * distanceXRatio - scaleX
        viewport.position.y -= viewNewRect.height * distanceYRatio - scaleY
        renderViewStyle()
    })
}

//是否处于全屏
const isFullScreen = ref(false)

/**
 * 全屏
 */
const fullscreen = () => {
    isFullScreen.value = !isFullScreen.value
    if (isFullScreen.value) {
        boardDom.value!.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

/**
 * 全屏
 */
const onBoardFullscreenChange = (event: Event) => {
    fitViewport()
}

/**
 * 缩放
 * @param scale 缩放多少(不是缩放至多少)
 */
const zoom = (scale: number) => {
    const boardRect = boardDom.value!.getBoundingClientRect()
    scaleFromPoint(
        {
            x: boardRect.width / 2,
            y: boardRect.height / 2,
        },
        scale
    )
}

//放大/缩小的滑杆
const slider: Ref<HTMLInputElement | undefined> = ref()

watch(
    () => viewport.scale,
    (scale) => {
        if (props.showToolbar) {
            slider.value!.value = scale.toString()
        }
    }
)

/**
 * 显示全部内容
 */
const fitViewport = () => {
    const boardRect = boardDom.value!.getBoundingClientRect()
    const viewportRect = viewportDom.value!.getBoundingClientRect()
    const size = getChildrenSize()
    const scaleWidth = size.xmax - size.xmin
    const scaleHeight = size.ymax - size.ymin
    const realWidth = scaleWidth / viewport.scale
    const realHeight = scaleHeight / viewport.scale
    const scale = Math.min(boardRect.width / realWidth, boardRect.height / realHeight)
    //先缩放
    viewport.position.x = -size.xmin + boardRect.left
    viewport.position.y = -size.ymin + boardRect.top
    viewport.scale = scale
    renderViewStyle()
    //后调整位置
    {
        const size = getChildrenSize()
        const scaleWidth = size.xmax - size.xmin
        const scaleHeight = size.ymax - size.ymin
        viewport.position.x += (boardRect.width - scaleWidth) / 2 - size.xmin + boardRect.left
        viewport.position.y += (boardRect.height - scaleHeight) / 2 - size.ymin + boardRect.top
        renderViewStyle()
    }
}

/**
 * 获取子元素尺寸
 */
const getChildrenSize = () => {
    const size = {
        xmin: 0,
        ymin: 0,
        xmax: 0,
        ymax: 0
    }
    const children = viewportDom.value!.children
    for (let i = 0; i < children.length; i++) {
        const bound = children[i].getBoundingClientRect()
        if (i === 0 || bound.left < size.xmin) {
            size.xmin = bound.left
        }
        if (i === 0 || bound.top < size.ymin) {
            size.ymin = bound.top
        }
        if (i === 0 || bound.right > size.xmax) {
            size.xmax = bound.right
        }
        if (i === 0 || bound.bottom > size.ymax) {
            size.ymax = bound.bottom
        }
    }
    return size
}

let fitObserver: ResizeObserver | null = null;

/**
 * 自动缩放处理
 */
const fitResizer = (e: any) => {
    fitViewport()
}
onMounted(() => {
    if (props.fit) {
        fitViewport()
    }
    if (props.autoFit) {
        log(boardDom.value!)
        fitObserver = new ResizeObserver(fitResizer)
        fitObserver.observe(boardDom.value!)
    }
})

onUnmounted(() => {
    if (props.autoFit) {
        fitObserver?.disconnect()
        fitObserver = null;
    }
})
</script>

<style scoped lang="scss">
.kanban-board {
    position: absolute;
    inset: 0;
    background: #eee url("./images/gird.svg");
    overflow: hidden;

    .kanban-toolbar {
        position: absolute;
        left: 50%;
        bottom: 10px;
        transform: translateX(-50%);
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
