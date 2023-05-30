<!--
尖峰平谷时段
-->
<template>
    <div class="electricity-segment" :style="boundsStyle">
        <ul class="segment-names">
            <li v-for="(item,i) in segmentNames" :key="i" class="segment-name" :style="{left:item.x+'%',backgroundColor:item.color}">
                <span class="content">{{ item.name }}</span>
            </li>
        </ul>
        <div class="segment-color" :style="segmentStyle"></div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'ElectricitySegment'
}
</script>
<script lang="ts" setup>
import {computed} from 'vue'

interface Segment {
    //时段名称
    name: string,
    //起始时间，格式：10:30
    start: string,
    //结束时间，格式：10:30
    stop: string
}

//属性
const props = withDefaults(defineProps<{
    //边界
    bounds: [number, number, number, number]
    //间隔长度，多少分钟为一段 1小时=60 半小时=30
    interval?: number,
    //一共多少分钟
    minutes?: number,
    //时段
    segments: Segment[],
}>(), {
    bounds: () => {
        return [0, 0, 0, 0]
    },
    interval: 60,
    minutes: 1440,
    segments: () => {
        return []
    }
})

const boundsStyle = computed(() => {
    return {
        top: props.bounds[0] + 'px',
        right: props.bounds[1] + 'px',
        bottom: props.bounds[2] + 'px',
        left: props.bounds[3] + 'px',
    }
})

const segmentNames = computed(() => {
    return props.segments.map((segment) => {
        const color = calcColor(segment.name)
        const startPercent = calcPercent(segment.start)
        const stopPercent = calcPercent(segment.stop)
        return {
            name: segment.name,
            color: color,
            x: (stopPercent + startPercent) / 2
        }
    })
})

const segmentStyle = computed(() => {
    const images = []
    for (const segment of props.segments) {
        const color = calcColor(segment.name, .3)
        const startPercent = calcPercent(segment.start)
        const stopPercent = calcPercent(segment.stop)
        images.push(`linear-gradient(90deg,transparent ${startPercent}%,${color} ${startPercent}%,${color} ${stopPercent}%,transparent ${stopPercent}%)`)
    }
    return {
        backgroundImage: images.join(',')
    }
})

/**
 * 计算颜色
 */
const calcColor = (name: string, opacity: number = 1) => {
    let color = 0x333333
    if (name === '尖') {
        color = 0xE83434
    } else if (name === '峰') {
        color = 0xFFBD2F
    } else if (name === '平') {
        color = 0x2FCCFF
    } else if (name === '谷') {
        color = 0x34E889
    }
    return '#' + color.toString(16) + Math.round(255 * opacity).toString(16)
}

/**
 * 计算时间所占的百分比
 */
const calcPercent = (time: string) => {
    return (timeToMinutes(time) / props.interval) / (props.minutes / props.interval) * 100
}

/**
 * 将时间字符串转换成分钟数
 * @param time 时间，示例 08:30
 */
const timeToMinutes = (time: string) => {
    const [hour, minute] = [...time.split(':')]
    return parseInt(hour) * 60 + parseInt(minute)
}

</script>

<style lang="scss" scoped>
.electricity-segment {
    box-sizing: border-box;
    position: absolute;
    user-select: none;
    pointer-events: none;
    z-index: 0;

    .segment-names {
        position: absolute;
        top: -30px;
        right: 0;
        bottom: 0;
        left: 0;

        .segment-name {
            position: absolute;
            top: 0;
            transform: translateX(-50%);
            border-radius: 3px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;

            .content {
                font-size: 12px;
                color: black;
            }
        }
    }

    .segment-color {
        position: absolute;
        inset: 0;
    }
}
</style>
