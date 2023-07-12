<!--
功能：多类型日期切换
作者：wutong
日期：2023-07-06
-->
<template>
    <div class="date-switcher">
        <slot></slot>
        <el-button v-if="props.showArrow" :icon="ArrowLeft" type="primary" text @click="previousDate"></el-button>
        <el-date-picker v-if="compType === 'date'" type="date" :clearable="false" v-model="compDate" @change="dateChange"></el-date-picker>
        <el-date-picker v-if="compType === 'month'" type="month" :clearable="false" v-model="compDate" @change="dateChange"></el-date-picker>
        <el-date-picker v-if="compType === 'year'" type="year" :clearable="false" v-model="compDate" @change="dateChange"></el-date-picker>
        <el-button v-if="props.showArrow" :icon="ArrowRight" type="primary" text @click="nextDate"></el-button>
        <el-radio-group v-model="compType">
            <el-radio-button label="date" v-if="excludes!.indexOf('date')===-1" @change="dateChange">日</el-radio-button>
            <el-radio-button label="month" v-if="excludes!.indexOf('month')===-1" @change="dateChange">月</el-radio-button>
            <el-radio-button label="year" v-if="excludes!.indexOf('year')===-1" @change="dateChange">年</el-radio-button>
        </el-radio-group>
    </div>
</template>

<script lang="ts" setup>
import {useVModel} from '@vueuse/core'
import {ArrowLeft, ArrowRight} from '@element-plus/icons-vue'
import moment from 'moment'

//属性
const props = withDefaults(defineProps<{
    //日期
    modelValue?: Date | undefined,
    //日期类型
    type?: string,
    //不需要显示的日期类型集合
    excludes?: ('date' | 'month' | 'year')[],
    //是否显示箭头
    showArrow?: boolean,
}>(), {
    modelValue() {
        return new Date()
    },
    type: 'date',
    excludes() {
        return []
    },
    showArrow: false
})

//事件
const emit = defineEmits<{
    (e: 'update:modelValue', date: Date): void,
    (e: 'update:type', type: string): void,
    (e: 'change', date: {
        //日期Date实例
        date: Date,
        //根据不同的日期类型填充的日期字符串
        dateContent: string
    }): void,
}>()

//日期
const compDate = useVModel(props, 'modelValue', emit)
//日期类型
const compType = useVModel(props, 'type', emit)

/**
 * 日期改变
 */
const dateChange = (date: Date) => {
    let format = 'YYYY-MM-DD'
    if (compType.value === 'month') {
        format = 'YYYY-MM'
    } else if (compType.value === 'year') {
        format = 'YYYY'
    }
    emit(
        'change',
        {
            date: date,
            dateContent: moment(date).format(format)
        }
    )
}

/**
 * 下个日期
 */
const nextDate = () => {
    if (compType.value === 'date') {
        compDate.value = moment(compDate.value).add('1', 'days').toDate()
    } else if (compType.value === 'month') {
        compDate.value = moment(compDate.value).add('1', 'M').toDate()
    } else if (compType.value === 'year') {
        compDate.value = moment(compDate.value).add('1', 'y').toDate()
    }
    dateChange(compDate.value)
}

/**
 * 上个日期
 */
const previousDate = () => {
    if (compType.value === 'date') {
        compDate.value = moment(compDate.value).subtract('1', 'days').toDate()
    } else if (compType.value === 'month') {
        compDate.value = moment(compDate.value).subtract('1', 'M').toDate()
    } else if (compType.value === 'year') {
        compDate.value = moment(compDate.value).subtract('1', 'y').toDate()
    }
    dateChange(compDate.value)
}
</script>

<style lang="scss" scoped>
.date-switcher {
    display: flex;
    align-items: center;
    gap: 5px;

    :deep(.el-date-editor ) {
        --el-date-editor-width: 130px;
    }
}
</style>
