<!--
功能：图表组件
日期：2022-03-09
变更：
     2022-04-17 模块切换图表消失问题、配置参数不使用合并行为
     2022-05-08 增加显示表格（折线图、柱形图、饼图)、下载图片功能
     2022-07-20 修复在使用其他类型series无法重置尺寸的问题
     2022-09-30 重构部分代码
     2023-04-10 增加防抖
-->
<template>
    <div ref="chartContainer" :style="style" class="chart-container">
        <div ref="chartInstance" class="chart-instance"></div>
        <transition name="el-fade-in" mode="out-in">
            <div v-show="showTable" class="chart-table">
                <el-table :data="tableRows" :height="table.height" :size="table.size" border row-key="key">
                    <el-table-column v-for="(column,i) in tableColumns" :key="column" :fixed="i===0" :label="column" align="center" :show-overflow-tooltip="true">
                        <template v-slot="{row}">{{ row[i] }}</template>
                    </el-table-column>
                </el-table>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import {EChartsOption, EChartsType, SeriesOption} from 'echarts'
import {BarDataItemOption} from 'echarts/types/src/chart/bar/BarSeries'
import {LineDataItemOption} from 'echarts/types/src/chart/line/LineSeries'
import {PieDataItemOption} from 'echarts/types/src/chart/pie/PieSeries'
import {CategoryAxisBaseOption} from 'echarts/types/src/coord/axisCommonTypes'
import {ref, reactive, onMounted, watch, onUnmounted, nextTick, computed, Ref} from 'vue'
import * as echarts from 'echarts'
import {debounce} from "@/utils/task";

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
    option: EChartsOption,
    //重置图表尺寸是否使用动画
    resizeAnimation?: boolean,
    //是否显示表格
    showTable?: boolean
}>(), {
    resizeAnimation: true,
    showTable: false
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
    height: number | undefined
} = reactive({
    size: 'small',
    height: undefined
})

//在图表选项变化的时候更新图表
watch(
    () => props.option,
    () => {
        instance!.setOption(props.option, true)
    },
    {
        deep: true
    }
)

/**
 * 表格列集合
 */
const tableColumns = computed(() => {
    const option = props.option
    if (option.xAxis) {
        const xAxis = (Array.isArray(option.xAxis) && option.xAxis.length > 0 ? option.xAxis[0] : option.xAxis) as CategoryAxisBaseOption
        if (Array.isArray(xAxis.data)) {
            return ['类型', ...xAxis.data!]
        }
    }
    //如果序列里有饼图则最终以饼图出现的为最终列
    for (let series of <SeriesOption[]>option.series!) {
        if (series.type === 'pie') {
            return ['类型', '值']
        }
    }
    return []
})


/**
 * 表格行集合
 */
const tableRows = computed(() => {
    const option = props.option
    const rows = []
    for (let series of <SeriesOption[]>option.series!) {
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
}

/**
 * 下载为图片
 * @param {string} name 文件名
 */
const downloadAsImage = (name = '图表') => {
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

defineExpose({
    instance,
    container,
    downloadAsImage
})

onMounted(() => {
    container = <HTMLElement>chartContainer.value!.parentElement
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
        instance!.setOption(props.option, true)
        //监听尺寸变化以便重置图表尺寸
        observer = new ResizeObserver(debounce(observerResize,500))
        observer.observe(container!)
    })
})

onUnmounted(() => {
    observer?.disconnect()
    instance?.dispose()
})
</script>

<style lang="scss" scoped>
.chart-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    .chart-instance {
        position: absolute !important;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
}

.chart-table {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>
