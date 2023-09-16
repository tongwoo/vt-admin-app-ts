<!--
功能：修改密码
-->
<template>
    <div class="form-container">
        <el-form ref="form" :model="model" :rules="rules" size="default" label-width="90px" label-suffix=":" :disabled="loading" @submit.prevent>
            <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="model.oldPassword" type="password" autocomplete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="model.newPassword" type="password" autocomplete="new-password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="model.confirmPassword" type="password" autocomplete="new-password" show-password></el-input>
            </el-form-item>
            <div class="error-container" v-if="tip">
                <el-alert type="error" :description="tip" :closable="false" show-icon></el-alert>
            </div>
            <div class="footer-container">
                <el-button :icon="CircleCloseFilled" @click="onCancelBtnClick">取消</el-button>
                <el-button type="primary" :icon="CircleCheckFilled" @click="onSaveBtnClick" :loading="loading" native-type="submit">保存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import {ref, reactive} from 'vue'
import {ElMessage as messageTip, FormInstance, FormRules} from 'element-plus'
import {httpErrorHandler} from '@/utils/error'
import {http} from '@/utils/http'
import {CircleCheckFilled, CircleCloseFilled} from '@element-plus/icons-vue'

//事件
const emit = defineEmits(['close'])
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
const rules: FormRules = {
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
const onSaveBtnClick = async () => {
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
const onCancelBtnClick = () => {
    emit('close', 'cancel')
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
            emit('close')
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}
</script>
