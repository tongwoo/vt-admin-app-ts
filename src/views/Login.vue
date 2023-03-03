<!--
功能：用户登录
日期：2022-02-09
-->
<template>
    <div class="login-container">
        <div class="login-brand">
            <img src="@/assets/logo.svg" alt=""> {{ name }}
        </div>
        <div class="login-box">
            <!--登录界面图-->
            <div class="login-welcome">
                <h1>前端儿脚手架管理系统</h1>
            </div>
            <!--登录框-->
            <div class="login-panel">
                <div class="panel-header">登录系统</div>
                <div class="panel-body">
                    <el-form ref="form" :model="model" :rules="rules" :disabled="loading" label-width="80px" label-position="top" size="large" hide-required-asterisk @submit.prevent>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="model.username" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="登录密码" prop="password">
                            <el-input v-model="model.password" type="password" autocomplete="new-password" placeholder="请输入登录密码"></el-input>
                        </el-form-item>
                        <!--
                        <el-form-item label="验证码" prop="captcha">
                            <div class="captcha-container">
                                <el-input v-model="model.captcha"></el-input>
                                <img ref="captcha" src="" alt="" @click="refreshCaptcha">
                            </div>
                        </el-form-item>
                        -->
                        <el-collapse-transition>
                            <div class="error-container" v-if="tip">
                                <el-alert type="error" title="提示" :description="tip" :closable="false" show-icon></el-alert>
                            </div>
                        </el-collapse-transition>
                        <el-button type="primary" round @click="submitLogin" native-type="submit" :loading="loading">登录</el-button>
                        <div class="separator"><span class="text">或者</span></div>
                        <el-button round>找回密码</el-button>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {ref, reactive, onMounted} from 'vue'
import {ElLoading as loadingTip, ElMessage as messageTip, FormInstance} from 'element-plus'
import {useRouter} from 'vue-router'
import defaultAvatar from '@/assets/images/icons/avatar-default.png'
import {cleanAuthorization, writeAuthorization} from '@/utils/authorize'
import {httpErrorHandler} from '@/utils/error'
import setting from '@/setting'
import {API_PATH_DEFAULT} from '@/constants/api-path'
import {fetchProfile, requestLogin} from '@/modules/authorization'
import {useAppStore, useUserStore} from '@/pinia'

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()

//系统名
const name = setting.name
//表单
const form = ref<FormInstance>()
//验证码
const captcha = ref<HTMLImageElement>()
//错误信息
const tip = ref<string | null>(null)
//加载中
const loading = ref(false)
//登录模型
const model = reactive({
    //用户名
    username: null,
    //密码
    password: null,
    //验证码
    captcha: null,
})
//规则
const rules = {
    //用户名
    username: [
        {
            type: 'string',
            required: true,
            message: '',
        },
    ],
    //密码
    password: [
        {
            type: 'string',
            required: true,
            message: '',
        },
    ],
    //验证码
    captcha: [
        {
            type: 'string',
            required: false,
            message: '验证码必须填写',
        },
        {
            type: 'string',
            len: 4,
            message: '验证码必须是4位',
        },
    ],
}

/**
 * 刷新验证码
 */
const refreshCaptcha = () => {
    captcha.value!.src = API_PATH_DEFAULT + '/login/captcha?v=' + Math.random()
}

/**
 * 清除相关数据
 */
const clean = () => {
    cleanAuthorization()
}

/**
 * 提交登录
 */
const submitLogin = async () => {
    tip.value = null
    //表单是否有效
    const success = await form.value!.validate().catch(() => false)
    if (!success) {
        return
    }
    //登录参数
    const params = {
        username: model.username,
        password: model.password,
        captcha: model.captcha,
    }
    loading.value = true
    requestLogin(params).then((result) => {
        debugger
        if (!result.success) {
            tip.value = result.message ?? '网络错误'
            return false
        }
        //授权数据
        const authorization = result.data.token
        //保存授权数据
        writeAuthorization(authorization)
        //填充用户信息
        userStore.$patch((state) => {
            state.authorization = authorization
            state.nickname = result.data.name
            state.avatar = result.data.avatar ?? defaultAvatar
            state.permissions = result.data.permissions
        })
        //加载用户数据（如果需要额外调用接口的话）
        //loadProfile();
        router.push('/').catch((err) => {
            console.error('跳转出现异常：', err)
        })
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

/**
 * 载入用户信息
 */
const loadProfile = () => {
    const loading = loadingTip.service({
        lock: true,
        text: '初始化中',
    })
    fetchProfile().then((result) => {
        if (!result.success) {
            tip.value = result.message
            return false
        }
        userStore.$patch((state) => {
            state.nickname = result.data.name
            state.avatar = defaultAvatar
            state.permissions = result.data.permissions
        })
        router.push('/').catch((err) => {
            console.error('跳转出现异常：', err)
        })
    }).catch(httpErrorHandler).finally(() => {
        loading.close()
    })
}

onMounted(() => {
    clean()
    //refreshCaptcha();
})
</script>

<style lang="scss" src="../assets/styles/login.scss" scoped></style>
