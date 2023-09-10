<!--
功能：图表示例
作者：tongwoo
日期：2022-02-22
-->
<template>
    <div class="page-container">
        <div class="page-segment">
            <div class="segment-header with-bordered">
                <div class="header-flex">
                    <div class="header-title">图表示例</div>
                    <div class="header-flexible"></div>
                    <div class="header-buttons">
                        <el-button type="primary" size="small" @click="show=!show"><i class="bi bi-table el-icon--left"></i>{{ show ? '隐藏表格' : '显示表格' }}</el-button>
                    </div>
                </div>
            </div>
            <div class="segment-body">
                <ul class="chart-items">
                    <li class="chart-item">
                        <easy-chart :option="baseLine" :show-table="show"></easy-chart>
                    </li>
                    <li class="chart-item">
                        <easy-chart :option="baseBar" :show-table="show"></easy-chart>
                    </li>
                    <li class="chart-item">
                        <easy-chart :option="basePie" :show-table="show"></easy-chart>
                    </li>
                    <li class="chart-item">
                        <easy-chart :option="baseRadar"></easy-chart>
                    </li>
                    <li class="chart-item">
                        <easy-chart :option="baseScatter"></easy-chart>
                    </li>
                    <li class="chart-item">
                        <easy-chart :option="baseLine" :show-table="show"></easy-chart>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import EasyChart from "@/components/easy-chart.vue"
import {reactive, ref} from "vue"
import {buildBaseBarOption, buildBaseLineOption, buildBasePieOption, buildBaseRadarOption, buildBaseScatterOption} from "@/charts/examples/demo";

const show = ref(false)

const baseLine = (buildBaseLineOption())
const baseBar = (buildBaseBarOption())
const basePie = (buildBasePieOption())
const baseRadar = (buildBaseRadarOption())
const baseScatter = (buildBaseScatterOption())
</script>
<style lang="scss" scoped>
.chart-items {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 10px;
    height: calc(100vh - 200px);
    list-style: none;
    margin: 0;
    padding: 0;

    .chart-item {
        border: 1px solid #eee;
        padding: 5px;
    }
}
</style>
