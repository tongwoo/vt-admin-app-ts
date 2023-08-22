<!--
功能：在值为 null,undefined 的时候显示默认文本
日期：2022-03-09
变更：
     2022-09-30 增加跳动选项
     2023-04-28 增加slot
-->
<template>
    <span v-if="props.isJump && isNumber" class="optional-text" key="count"><span ref="el"></span><slot></slot></span>
    <span v-else class="optional-text" key="text">{{ content }}<slot></slot></span>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue'
import {CountUp, CountUpOptions} from 'countup.js'

//属性
const props = withDefaults(defineProps<{
    modelValue: string | number | null | undefined,
    //值不符合规则显示的替换文本，默认为 "--"
    text?: string | number,
    //是否跳动
    isJump?: boolean,
    //跳动参数
    jumpOption?: CountUpOptions
}>(), {
    text: '--',
    jsJump: false,
    jumpOption: () => {
        return {}
    }
})

//数据是否数值
const isNumber = computed(() => {
    return /^[\d\\.]+$/g.test(String(props.modelValue))
})

//非跳动显示的内容
const content = computed(() => {
    if (props.modelValue === null || props.modelValue === '' || props.modelValue === undefined) {
        return props.text
    }
    return props.modelValue
})

//跳动实例
let countUp: CountUp | null = null
//跳动元素
const el = ref(null)
//跳动默认配置
const defaultJumpOption = {
    startVal: 0, // 起始值
    decimalPlaces: 0, // 几位小数
    duration: 2, // 动画时长，秒
    useGrouping: false, // 是否进行分组，比如千进制逗号分隔
    useEasing: true, // 是否平滑动画
    smartEasingThreshold: 999, // smooth easing for large numbers above this if useEasing (999)
    smartEasingAmount: 333, // amount to be eased for numbers above threshold (333)
    separator: ',', // 分组分隔符
    decimal: '.', // 小数分隔符
    // easingFn: easing function for animation (easeOutExpo)
    //easingFn: (t: number, b: number, c: number, d: number) => number,
    //formattingFn: (n: number) => string, // this function formats result
    prefix: '', // 前缀
    suffix: '', // 后缀
    numerals: [], // numeral glyph substitution
    enableScrollSpy: false, // start animation when target is in view
    scrollSpyDelay: 0, // 滚动条滚动到的时候延迟多少毫秒开始动画
    scrollSpyOnce: true // 是否运行一次（滚动条）
}

watch(
    () => props.modelValue,
    () => {
        updateCountUp()
    }
)

watch(
    () => props.isJump,
    () => {
        updateCountUp()
    }
)

/**
 * 初始化跳动实例
 */
const initCountUp = () => {
    if (!el.value) {
        return
    }
    countUp = new CountUp(el.value, props.modelValue as number, {
        ...defaultJumpOption,
        ...props.jumpOption
    })
    countUp.start()
}

/**
 * 更新跳动实例
 */
const updateCountUp = () => {
    if (!props.isJump || !isNumber.value) {
        countUp = null
        return
    }
    nextTick(() => {
        if (countUp === null) {
            initCountUp()
        }
        countUp!.update(props.modelValue as number)
    })
}

onMounted(() => {
    initCountUp()
})
</script>

<style lang="scss" scoped>
.optional-text, .optional-text * {
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
}
</style>
