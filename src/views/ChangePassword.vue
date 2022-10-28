<!--
功能：修改密码
作者：tongwoo
日期：2022-03-03
-->
<template>
    <div class="form-container">
        <el-form ref="form" :model="model" :rules="rules" size="default" label-width="100px" label-suffix=":" :disabled="loading" @submit.prevent>
            <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="model.oldPassword" type="password" autocomplete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="model.newPassword" type="password" autocomplete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="model.confirmPassword" type="password" autocomplete="new-password"></el-input>
            </el-form-item>
            <div class="error-container" v-if="tip">
                <el-alert type="error" :description="tip" :closable="false" show-icon></el-alert>
            </div>
            <div class="footer-container">
                <el-button type="default" @click="cancelBtnClick"><i class="bi bi-x-circle-fill el-icon--left"></i>取消</el-button>
                <el-button type="primary" @click="saveBtnClick" :loading="loading" native-type="submit"><i class="bi bi-check-circle-fill el-icon--left"></i>保存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import {ref, reactive} from "vue"
import {ElMessage as messageTip, FormInstance} from "element-plus"
import {httpErrorHandler} from "@/utils/error"
import {http} from "@/utils/http"

//事件
const emits = defineEmits(['close'])
//加载中
const loading = ref(false)
//表单
const form = ref<FormInstance>()
//错误
const tip = ref<string | null>(null)
//模型
const model = reactive({
    //旧密码
    oldPassword: null,
    //新密码
    newPassword: null,
    //确认密码
    confirmPassword: null
})
//验证规则
const rules = {
    oldPassword: [
        {
            type: 'string',
            required: true,
            message: '请填写旧密码'
        }
    ],
    newPassword: [
        {
            type: 'string',
            required: true,
            message: '请填写新密码'
        }
    ],
    confirmPassword: [
        {
            type: 'string',
            required: true,
            message: '请填写确认密码'
        }
    ]
}

/**
 * 保存按钮点击
 */
const saveBtnClick = async () => {
    tip.value = null
    const success = await form.value!.validate().catch(() => false)
    if (!success) {
        return
    }
    if (model.newPassword !== model.confirmPassword) {
        tip.value = '两次输入的密码不一致'
        return
    }
    submitUpdate({
        oldPassword: model.oldPassword,
        newPassword: model.newPassword
    })
}

/**
 * 取消按钮点击
 */
const cancelBtnClick = () => {
    emits('close', 'cancel')
}

/**
 * 提交更新密码
 * @param data 数据
 */
const submitUpdate = (data: object) => {
    tip.value = null
    loading.value = true
    http.post(
        '/user/update-password',
        data
    ).then((response) => {
        if (!response.isOk) {
            tip.value = response.data.message
        } else {
            messageTip.success(response.data.message)
            emits('close')
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}
</script>
