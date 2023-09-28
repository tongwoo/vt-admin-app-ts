<!--
功能：忘记密码
作者：wutong
日期：2023-09-27
-->
<template>
    <div class="form-container">
        <el-form ref="form" :model="model" :rules="rules" size="default" label-width="90px" label-suffix=":" :disabled="loading" @submit.prevent>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="model.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
                <div class="form-item-auto">
                    <el-input v-model="model.captcha" maxlength="4" placeholder="验证码"></el-input>
                </div>
                <el-button class="ml-5" type="primary" :disabled="captcha.seconds>0" @click="onCaptchaBtnClick">{{ captchaText }}</el-button>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="model.newPassword" type="password" autocomplete="new-password" placeholder="必须是8~16位包含大小写字母、数字和特殊字符" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="model.confirmPassword" type="password" autocomplete="new-password" show-password></el-input>
            </el-form-item>
            <div class="error-container" v-if="tip">
                <el-alert type="error" :description="tip" :closable="false" show-icon></el-alert>
            </div>
            <div class="footer-container">
                <el-button :icon="CircleCloseFilled" @click="onCancelBtnClick">取消</el-button>
                <el-button type="primary" :icon="CircleCheckFilled" @click="onSaveBtnClick" :loading="loading" native-type="submit">确定</el-button>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import {ref, reactive, computed, onUnmounted, onMounted} from 'vue'
import {ElMessage as messageTip, FormInstance, FormRules} from 'element-plus'
import {httpErrorHandler} from '@/utils/error'
import {http} from '@/utils/http'
import {PATTERN_MOBILE_NUMBER, PATTERN_NUMERIC, PATTERN_SPECIAL_SYMBOL, PATTERN_WORD_LOWER, PATTERN_WORD_UPPER} from '@/constants/pattern'
import {CircleCheckFilled, CircleCloseFilled, Right} from '@element-plus/icons-vue'
import router from '@/router'
import {useAppStore} from '@/pinia/app'
import {isComplex} from '@/utils/validator'

const appStore = useAppStore()

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
    //手机号
    phone: null,
    //验证码
    captcha: null,
    //新密码
    newPassword: null,
    //确认密码
    confirmPassword: null
})
//验证规则
const rules: FormRules = {
    phone: [
        {
            type: 'string',
            required: true,
            message: '请填写手机号'
        },
        {
            type: 'pattern',
            pattern: PATTERN_MOBILE_NUMBER,
            message: '请填写正确的手机号'
        }
    ],
    captcha: [
        {
            type: 'string',
            required: true,
            message: '请填写验证码'
        }
    ],
    newPassword: [
        {
            type: 'string',
            required: true,
            message: '请填写新密码'
        },
        {
            type: 'string',
            validator: (rule, value, callback) => {
                const message = '必须是8~16位包含大小写字母、数字和特殊字符'
                if (!(value.length >= 8 && value.length <= 16)) {
                    callback(message)
                }
                if (!isComplex(value)) {
                    callback(message)
                }
                callback()
            }
        },
    ],
    confirmPassword: [
        {
            type: 'string',
            required: true,
            message: '请填写确认密码'
        },
        {
            type: 'string',
            validator: (rule, value, callback) => {
                if (model.newPassword !== value) {
                    callback('两次输入的密码不一致')
                }
                callback()
            }
        },
    ]
}

//倒计时总共要多少秒
const seconds = 6
//验证码参数
const captcha = reactive({
    loading: false,
    //还剩多少秒
    seconds: 0,
    //定时器id
    ticktock: -1
})

const captchaText = computed(() => {
    return captcha.seconds > 0 ? `剩余${captcha.seconds}秒` : '获取验证码'
})

/**
 * 获取验证码按钮点击
 */
const onCaptchaBtnClick = async () => {
    const result = await form.value!.validateField('phone').catch(() => false)
    if (!result) {
        return
    }
    if (captcha.seconds > 0) {
        return
    }
    captcha.loading = true
    fetchCaptcha().then((response) => {
        if (response.isOk) {
            captcha.seconds = seconds
            startTicktock()
            messageTip.success('验证码已发送')
        } else {
            messageTip.error(response.data.message)
        }
    }).catch(httpErrorHandler).finally(() => {
        captcha.loading = false
    })
}

/**
 * 启动定时器
 */
const startTicktock = () => {
    captcha.ticktock = window.setInterval(() => {
        if (captcha.seconds > 0) {
            captcha.seconds -= 1
        } else {
            stopTicktock()
        }
    }, 1000)
}

/**
 * 停止定时器
 */
const stopTicktock = () => {
    window.clearInterval(captcha.ticktock)
}

onMounted(() => {
    if (captcha.seconds > 0) {
        startTicktock()
    }
})

onUnmounted(() => {
    stopTicktock()
})

/**
 * 获取验证码
 */
const fetchCaptcha = () => {
    return Promise.resolve({
        isOk: true
    })
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
        phone: model.phone,
        captcha: model.captcha,
        password: model.newPassword
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
        '/admin/system/user/editPassword',
        data
    ).then((response) => {
        if (!response.isOk) {
            tip.value = response.data.message
        } else {
            messageTip.success(response.data.message)
            emit('close', 'changed')
            router.replace('/login')
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}
</script>
