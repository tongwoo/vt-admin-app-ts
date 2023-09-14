<!--
功能：图表组件
日期：2022-03-09
变更：
     2022-04-17 模块切换图表消失问题、配置参数不使用合并行为
     2022-05-08 增加显示表格（折线图、柱形图、饼图)、下载图片功能
     2022-07-20 修复在使用其他类型series无法重置尺寸的问题
     2022-09-30 重构部分代码
     2023-04-10 增加防抖
     2023-07-04 增加没数据的提示插槽
     2023-09-14 增加两点之间为null的话则修复为中间值
-->
<template>
    <div ref="chartContainer" :style="style" class="chart-container">
        <slot name="empty" v-if="!showTable && !hasDara">
            <div class="message-tip">暂无数据</div>
        </slot>
        <div ref="chartInstance" class="chart-instance" @dblclick="onChartDblClick"></div>
        <div v-if="showTable" class="chart-table">
            <el-table-v2 v-if="tableV2" class="chart-tablev2" :columns="tableColumns" :data="tableRows" border :size="table.size" row-key="key" :height="table.height" :width="table.width" fixed></el-table-v2>
            <el-table v-else :data="tableRows" :height="table.height" :size="table.size" border row-key="key">
                <el-table-column v-for="(column,i) in tableColumns" :key="column" :fixed="i===0" :label="column" align="center" :show-overflow-tooltip="true">
                    <template v-slot="{row}">{{ row[i] }}</template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import 'echarts-gl'
import {EChartsOption, EChartsType, SeriesOption} from 'echarts'
import {BarDataItemOption} from 'echarts/types/src/chart/bar/BarSeries'
import {LineDataItemOption} from 'echarts/types/src/chart/line/LineSeries'
import {PieDataItemOption} from 'echarts/types/src/chart/pie/PieSeries'
import {CategoryAxisBaseOption} from 'echarts/types/src/coord/axisCommonTypes'
import {ref, reactive, onMounted, watch, onUnmounted, nextTick, computed, Ref} from 'vue'
import * as echarts from 'echarts'
import {debounce} from '@/utils/task'

//图表实例
let instance: EChartsType | null = null
//图表父容器元素
let container: HTMLElement | null = null
//父容器观察器
let observer: ResizeObserver | null = null
//图表父容器
const chartContainer: Ref<HTMLElement | null> = ref(null)
//图表挂载的DOM
const chartInstance: Ref<HTMLElement | null> = ref(null)

//属性
const props = withDefaults(defineProps<{
    //echarts配置对象
    option: any,
    //重置图表尺寸是否使用动画
    resizeAnimation?: boolean,
    //是否显示表格
    showTable?: boolean
    //是否使用element-ui的表格v2版本
    tableV2?: boolean,
    //序列首行名称
    seriesHeaderName?: string,
    //双击恢复数据缩放
    enableZoomReset?: boolean,
    //是否自动修复2个数据之间有null进行平均值填充
    fixBreak?: boolean,
}>(), {
    resizeAnimation: true,
    showTable: false,
    tableV2: false,
    seriesHeaderName: '序列',
    fixBreak: false
})

//是否有数据
const hasDara = computed(() => {
    let xAxis
    if (props.option?.xAxis !== undefined) {
        if (Array.isArray(props.option?.xAxis)) {
            xAxis = props.option.xAxis?.[0]
        } else {
            xAxis = props.option.xAxis
        }
        return xAxis?.data?.length !== 0
    }
    return true
})

//样式
const style = computed(() => {
    return {
        top: position.top + 'px',
        right: position.right + 'px',
        bottom: position.bottom + 'px',
        left: position.left + 'px'
    }
})

//位置
const position = reactive({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
})

//表格
const table: {
    size: string,
    height: number,
    width: number,
} = reactive({
    size: 'small',
    height: 100,
    width: 400,
})

//在图表选项变化的时候更新图表
watch(
    () => props.option,
    () => {
        if (props.fixBreak) {
            fixBreakData(props.option)
        }
        instance!.setOption(props.option as EChartsOption, true)
    },
    {
        deep: true
    }
)

/**
 * 表格列集合
 */
//const tableColumnsBak = computed(() => {
//    const option = props.option
//    if (option.xAxis) {
//        const xAxis = (Array.isArray(option.xAxis) && option.xAxis.length > 0 ? option.xAxis[0] : option.xAxis) as CategoryAxisBaseOption
//        if (Array.isArray(xAxis.data)) {
//            return ['类型', ...xAxis.data!]
//        }
//    }
//    如果序列里有饼图则最终以饼图出现的为最终列
//for (let series of option.series!) {
//    if (series.type === 'pie') {
//        return ['类型', '值']
//    }
//}
//return []
//})

/**
 * 表格列集合
 */
const tableColumns = computed(() => {
    const option = props.option
    if (option.xAxis) {
        const xAxis = (Array.isArray(option.xAxis) && option.xAxis.length > 0 ? option.xAxis[0] : option.xAxis) as CategoryAxisBaseOption
        if (Array.isArray(xAxis.data)) {
            if (props.tableV2) {
                return [props.seriesHeaderName, ...xAxis.data!].map((axis, index) => {
                    return {
                        fixed: index === 0,
                        class: 'chart-column',
                        headerClass: 'chart-header-column',
                        align: 'center',
                        title: axis,
                        dataKey: index,
                        key: axis,
                        width: 100,
                        minWidth: 100,
                        maxWidth: 120,
                    }
                })
            } else {
                return [props.seriesHeaderName, ...xAxis.data!]
            }
        }
    }
    //如果序列里有饼图则最终以饼图出现的为最终列
    for (let series of option.series!) {
        if (series.type === 'pie') {
            return [props.seriesHeaderName, '值']
        }
    }
    return []
})


/**
 * 表格行集合
 */
const tableRows = computed(() => {
    const rows = []
    for (let series of props.option.series!) {
        if (series.type === 'pie') {
            const items = series.data as PieDataItemOption[]
            items.forEach((item) => {
                rows.push([item.name, item.value])
            })
        } else if (series.type === 'line' || series.type === 'bar') {
            const items = series.data as BarDataItemOption[] | LineDataItemOption[]
            rows.push([series.name, ...items])
        }
    }
    return rows
})

/**
 * 图表重置尺寸
 */
const resizeChart = () => {
    if (props.resizeAnimation) {
        instance!.resize({
            animation: {
                duration: 1000
            }
        })
    } else {
        instance!.resize()
    }
}

/**
 * 表格重置尺寸
 */
const tableResize = () => {
    table.height = container!.clientHeight - position.top - position.bottom
    table.width = container!.clientWidth - position.left - position.right
}

/**
 * 下载为图片
 * @param name 文件名
 */
const downloadAsImage = (name: string = '图表') => {
    const dataUrl = instance!.getDataURL({
        type: 'png',
        excludeComponents: ['toolbox']
    })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = name + '.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

/**
 * 尺寸调整
 */
const observerResize = () => {
    resizeChart()
    tableResize()
}

const {destroy, handler} = debounce(observerResize, 300)

/**
 * 获取图表实例
 */
const getInstance = () => {
    return instance
}

defineExpose({
    getInstance,
    container,
    downloadAsImage
})

onMounted(() => {
    container = chartContainer.value!.parentElement
    if (!container) {
        throw new Error('没有找到父元素')
    }
    const style = window.getComputedStyle(container)
    //为了简单化，设置图表容器为绝对定位
    if (style.position === 'static') {
        container.style.position = 'relative'
    }
    //检查父元素有没有间距，有的话则修改定位
    position.top = parseInt(style.paddingTop)
    position.right = parseInt(style.paddingRight)
    position.bottom = parseInt(style.paddingBottom)
    position.left = parseInt(style.paddingLeft)
    nextTick(() => {
        //初始化图表
        instance = echarts.init(chartInstance.value!)
        if (props.fixBreak) {
            fixBreakData(props.option)
        }
        instance!.setOption(props.option, true)
        //监听尺寸变化以便重置图表尺寸
        observer = new ResizeObserver(handler)
        observer.observe(container!)
    })
})

onUnmounted(() => {
    observer?.disconnect()
    instance?.dispose()
    destroy()
})


/**
 * 图表双击
 */
const onChartDblClick = () => {
    if (!props.enableZoomReset) {
        return
    }
    instance!.dispatchAction({
        type: 'dataZoom',
        // 开始位置的百分比，0 - 100
        start: 0,
        // 结束位置的百分比，0 - 100
        end: 100,
    })
}

/**
 * 修复缺失的点，只算前后都有值的中间点，仅对折线图有效
 * @param option 图表选项
 */
const fixBreakData = (option: any) => {
    for (let i = 0; i < option.series.length; i++) {
        const series = option.series[i]
        if (series.type !== 'line') {
            continue
        }
        const items = series?.data ?? []
        for (let j = 0; j < items.length; j++) {
            if (j === 0 || j === items.length - 1) {
                continue
            }
            const item = items[j]
            if (item !== null) {
                continue
            }
            if (items[j - 1] === null || items[j + 1] === null) {
                continue
            }
            items[j] = (items[j - 1] + items[j + 1]) / 2
        }
    }
}
</script>
<style lang="scss" scoped>
.chart-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    .message-tip {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 99;
        transform: translateX(-50%) translateY(-50%);
        text-align: center;
        font-size: 14px;
        color: #489cea;
        background: #071426;
        border: 1px solid #23497e;
        padding: 10px 20px;
        line-height: 1;
    }
}

.chart-instance {
    position: absolute !important;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.chart-table {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>
