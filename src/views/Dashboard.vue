<!--
功能：首页
日期：2022-03-04
-->
<template>
    <div>
        {{a.asDate()}}
        {{a.asDate()}}
    </div>
</template>
<script lang="ts" setup>
import EasyChart from "@/components/EasyChart"
import moment from "moment"
import CountUp from '@/components/CountUp.vue'
import {buildSeasonLineOption, buildUserLineOption, buildUserWherePieOption} from "@/charts/examples/dashboard"
import {ref} from 'vue'

const seasonLine = buildSeasonLineOption()
const userLine = buildUserLineOption()
const userWherePie = buildUserWherePieOption()

/**
 * 百分比格式化
 */
const percentFormat = () => {
    return ''
}

const a = ref('2023-11-30T22:03')
const aa = ref(312.646)
/**
 * 订单
 */
interface Order {
    no: string,
    user: string,
    name: string,
    price: string | number,
    time: string
}

//订单
const orders: Order[] = [...new Array(8)].map((item) => {
    return {
        no: moment().format('YYYYMMDD') + Math.ceil(Math.random() * 100000),
        user: '东哥',
        name: 'PlayStation 5 耳机套装',
        price: (Math.random() * 1000).toFixed(2),
        number: Math.ceil(Math.random() * 10),
        time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
})
</script>

<style lang="scss" scoped>
.page-container {
    display: grid;
    grid-template-columns: 3fr 3fr 2fr;
    grid-template-rows: auto auto auto;
    grid-gap: 10px;

    .page-segment {
        margin-bottom: 0;
    }

    .summary-head {
        grid-column: 1/4;
    }

    .order-latest {
        grid-column: 1/3;
    }

    .user-where {
        grid-column: 3/4;
    }
}

.total-items {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;

    .separator {
        border-right: 1px solid #eee;
    }

    .total-item {

        &:last-child {
            border-right: 0 none;
        }

        .label {
            color: #a4acc4;
            font-size: 12px;
            margin-bottom: 10px;
        }

        .value {
            display: flex;
            gap: 20px;
            align-items: center;


            &.up {
                color: #12b252;
            }

            &.down {
                color: red;
            }

            .number {
                font-family: din;
                font-size: 20px;
                font-weight: bold;
                color: #2f3a47;
            }

            .flow {
                font-size: 12px;
            }

            .percent {
                font-size: 14px;
                font-weight: bold;
            }
        }
    }
}

.user-items {
    margin: 0;
    padding: 10px;

    .user-item {
        margin-bottom: 15px;

        &:last-child {
            margin-bottom: 0;
        }

        .info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: #5F6364;
        }

        .progress {
            margin-top: 8px;

            :deep(.el-progress__text) {
                flex: none;
                min-width: auto;
            }
        }
    }
}

.amount {
    font-family: din;
    font-weight: bold
}
</style>
