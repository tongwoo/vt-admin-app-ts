<!--
功能：页面不存在
作者：tongwoo
日期：2022-02-22
-->
<template>
    <div class="page-container">
        <div class="page-segment">
            <div class="segment-body">
                <div class="error-container">
                    <!--<div class="error-image"></div>-->
                    <div class="error-code">403</div>
                    <div class="error-content">
                        <p>权限不足，请检查您是否有足够的权限执行此操作</p>
                        <div class="mt-30">
                            <el-button type="primary" round @click="router.push('/')">返回首页</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter();

</script>

<style lang="scss" scoped>
.page-container {
    height: calc(100vh - 120px);
    display: flex;
    align-items: center;
    justify-content: center;

    .error-container {
        padding: 80px 100px;

        .error-code {
            text-align: center;
            font-size: 46px;
            font-weight: bold;
            color: #ced1d4;
        }

        .error-content {
            text-align: center;
            font-size: 14px;
            color: #5F6364;
            margin-top: 30px;
        }
    }
}
</style>
