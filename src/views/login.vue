<!--
用户登录
-->
<template>
    <div class="login-container">
        <div class="login-brand">
            <img src="@/assets/logo.svg" alt=""> {{ name }}
        </div>
        <div class="login-box">
            <!--登录界面图-->
            <div class="login-welcome">
                <h1>小前端儿的脚手架</h1>
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
                            <el-input v-model="model.password" type="password" autocomplete="new-password" placeholder="请输入登录密码" show-password></el-input>
                        </el-form-item>
                        <!--
                        <el-form-item label="验证码" prop="captcha">
                            <div class="captcha-container">
                                <el-input v-model="model.captcha"></el-input>
                                <img ref="captcha" src="" alt="" @click="refreshCaptcha">
                            </div>
                        </el-form-item>
                        -->
                        <div class="remember">
                            <el-checkbox v-model="remember">记住我</el-checkbox>
                        </div>
                        <div class="error-container" v-if="tip">
                            <el-alert type="error" title="提示" :description="tip" :closable="false" show-icon></el-alert>
                        </div>
                        <el-button type="primary" round @click="mockLogin" native-type="submit" :loading="loading">登录</el-button>
                        <el-divider content-position="center">或者</el-divider>
                        <el-button round @click="onForgetBtnClick">找回密码</el-button>
                    </el-form>
                </div>
            </div>
        </div>
        <el-dialog :title="forget.dialog.title" v-model="forget.dialog.show" :close-on-click-modal="false" @close="onForgetDialogClose" append-to-body width="500px" align-center>
            <transition name="el-fade-in" mode="out-in">
                <forget-password v-if="forget.dialog.show" :payload="forget.data" @close="onForgetDialogClose"></forget-password>
            </transition>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import {ref, reactive, onMounted} from 'vue'
import {ElLoading as loadingTip, ElMessage as messageTip, FormInstance, FormRules} from 'element-plus'
import {useRouter} from 'vue-router'
import defaultAvatar from '@/assets/images/icons/avatar-default.png'
import {cleanAuthorization, writeAuthorization} from '@/utils/authorize'
import {httpErrorHandler} from '@/utils/error'
import setting from '@/setting'
import {API_PATH_DEFAULT} from '@/constants/api-path'
import {fetchProfile, readRemember, removeRemember, requestLogin, writeRemember} from '@/modules/authorization'
import {useUserStore} from '@/pinia/user'
import {DialogOption, PropNullable} from '@/types/built-in'
import ForgetPassword from '@/views/forget-password.vue'
import {cloneObject} from '@/utils/object'

const userStore = useUserStore()
const router = useRouter()

//系统名
const name = setting.name
//记住我
const remember = ref(false)
//表单
const form = ref<FormInstance>()
//验证码
const captcha = ref<HTMLImageElement>()
//错误信息
const tip = ref<string | null>(null)
//加载中
const loading = ref(false)
//登录模型
const model: PropNullable<{
    //用户名
    username: string,
    //密码
    password: string,
    //验证码
    captcha: string,
}> = reactive({
    username: null,
    password: null,
    captcha: null
})
//规则
const rules: FormRules = {
    //用户名
    username: [
        {
            type: 'string',
            required: true,
            message: ''
        }
    ],
    //密码
    password: [
        {
            type: 'string',
            required: true,
            message: ''
        }
    ],
    //验证码
    captcha: [
        {
            type: 'string',
            required: false,
            message: '验证码必须填写'
        },
        {
            type: 'string',
            len: 4,
            message: '验证码必须是4位'
        }
    ]
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
 * 模拟登录
 */
const mockLogin = () => {
    userStore.$patch((state) => {
        state.authorization = 'test'
        state.nickname = '测试用户'
        state.avatar = defaultAvatar
        state.permissions = []
    })
    router.push('/').catch((err) => {
        console.error('跳转出现异常：', err)
    })
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
        captcha: model.captcha
    }
    loading.value = true
    requestLogin(params).then((result) => {
        if (!result.success) {
            tip.value = result.message ?? '网络错误'
            return false
        }
        //授权数据
        const authorization = result.data.token
        //保存授权数据
        writeAuthorization(authorization, remember.value ? 7 : undefined)
        //记住我
        if (remember.value) {
            writeRemember(remember.value, model.username!, model.password!)
        } else {
            removeRemember()
        }
        //填充用户信息
        userStore.$patch((state) => {
            state.authorization = authorization
            state.nickname = result.data.name
            state.avatar = result.data.avatar ? API_PATH_DEFAULT + result.data.avatar : defaultAvatar
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
        text: '初始化中'
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
    //处理「记住我」功能
    const data = readRemember()
    if (data) {
        remember.value = data?.remember ?? true
        model.username = data?.username ?? null
        model.password = data?.password ?? null
    }
})

/**
 * 忘记密码
 */
const forget: {
    //传递给表单的数据
    data: any,
    //弹框
    dialog: DialogOption
} = reactive({
    data: null,
    dialog: {
        show: false,
        title: '忘记密码'
    }
})

/**
 * 忘记密码按钮点击
 */
const onForgetBtnClick = (row: any) => {
    forget.dialog.show = true
}

/**
 * 忘记密码弹框关闭
 * @param payload 返回的数据
 */
const onForgetDialogClose = (payload: any) => {
    forget.dialog.show = false
}
</script>

<style lang="scss" src="../assets/styles/login.scss" scoped></style>
