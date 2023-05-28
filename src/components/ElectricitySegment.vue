<!--
功能：尖峰平谷时段背景+标签展示
作者：wutong
日期：2023-05-28
-->
<templatevfo>
    <div class="electricity-segment" :style="boundsStyle">
        <ul class="segment-names">
            <li v-for="(item,i) in segmentNames" :key="i" class="segment-name" :style="{left:item.x+'%',backgroundColor:item.color}">
                <span class="content">{{ item.name }}</span>
            </li>
        </ul>
        <div class="segment-color" :style="segmentStyle"></div>
    </div>
</templatevfo>

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
    //边界距离 上右下左
    bounds: [number, number, number, number]
    //长度，每整个小时=24 每半个小时=48 如果用于图表可能需要设置成长度-1
    length?: number,
    //时段
    segments: Segment[],
}>(), {
    bounds: () => {
        return [0, 0, 0, 0]
    },
    length: 24,
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
    const length = props.length <= 24 ? timeToHours(time) : timeToMinutes(time)
    return length / props.length * 100
}

/**
 * 将时间字符串转换成小时数
 * @param time 时间，示例 08:30
 */
const timeToHours = (time: string) => {
    const [hour, minute] = [...time.split(':')]
    return parseInt(hour) + parseInt(minute) / 60
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
