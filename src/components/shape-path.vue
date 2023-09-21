<!--
功能：用于效果图上展现的线条动画
作者：wutong
日期：2023-09-21
-->
<template>
    <div class="shape-path-container">
        <ul class="shape-path-segments">
            <li v-for="(item,i) in segments" :key="i" :class="trackClass" :style="item.style"></li>
        </ul>
        <svg class="shape-path-svg" width="100%" height="100%">
            <path :d="d" :stroke="props.stroke" :stroke-dasharray="props.strokeDasharray" :stroke-dashoffset="props.strokeDashoffset" :stroke-linecap="props.strokeLinecap" :stroke-opacity="props.strokeOpacity" :stroke-width="props.strokeWidth"></path>
        </svg>
    </div>
</template>

<script lang="ts" setup>
import {computed, Ref} from 'vue'

/**
 * 坐标点
 */
interface Point {
    x: number,
    y: number
}

/**
 * 线
 */
interface Line {
    //位置
    point: Point,
    //旋转多少度
    rotate: number,
    //轨道长度
    length: number,
    //样式
    style: Record<string, any>
}

//属性
const props = withDefaults(defineProps<{
    //坐标点集合
    points: Point[],
    //轨道宽度
    trackWidth?: number,
    //轨道样式
    trackClass?: string,
    //是否反向
    reverse?: boolean,
    //轮廓的颜色
    stroke?: string,
    //描边的点划线的图案范式
    strokeDasharray?: string,
    //dash模式到路径开始的距离
    strokeDashoffset?: string,
    //在开放子路径被设置描边的情况下，开放自路径两端的形状
    strokeLinecap?: 'butt' | 'round' | 'square',
    //轮廓的不透明度
    strokeOpacity?: string,
    //轮廓的宽度
    strokeWidth?: string,
}>(), {
    points: function () {
        return []
    },
    trackWidth: 5,
    reverse: false,
    stroke: 'none',
    strokeDasharray: 'none',
    strokeDashoffset: '1',
    strokeLinecap: 'butt',
    strokeOpacity: '1',
    strokeWidth: '1',
})

//路径集合
const d = computed(() => {
    const points = props.reverse ? props.points.reverse() : props.points
    return points.map((point, i) => {
        return (i === 0 ? 'M' : 'L') + `${point.x} ${point.y}`
    }).join(',')
})

//线段集合
const segments: Ref<Line[]> = computed(() => {
    const points = props.reverse ? props.points.reverse() : props.points
    return points.map((point, i) => {
        if (i === points.length - 1) {
            return {
                point,
                rotate: 0,
                length: 0,
                style: {}
            }
        }
        const nextPoint = points[i + 1]
        const x = nextPoint.x - point.x
        const y = nextPoint.y - point.y
        const length = Math.sqrt(x * x + y * y)
        let rotate = Math.abs(Math.asin(y / length) * 180 / Math.PI)
        if (x >= 0 && y >= 0) {
            rotate = 270 + rotate
        } else if (x <= 0 && y >= 0) {
            rotate = 90 - rotate
        } else if (x <= 0 && y <= 0) {
            rotate = 90 + rotate
        } else if (x >= 0 && y <= 0) {
            rotate = 270 - rotate
        }
        return {
            point,
            rotate,
            length,
            style: {
                left: point.x + 'px',
                top: point.y + 'px',
                height: length + 'px',
                transform: `translateX(-${props.trackWidth / 2}px) rotate(${rotate}deg)`,
                width: props.trackWidth + 'px',
            }
        }
    })
})
</script>

<style lang="scss" scoped>
.shape-path-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
}

.shape-path-segments {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    list-style: none;
    margin: 0;
    padding: 0;

    li {
        position: absolute;
        transform-origin: center top;
        background: url("../assets/images/arrow.png") center top repeat-y;
        background-size: auto;
    }
}

.shape-path-svg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
}
</style>
