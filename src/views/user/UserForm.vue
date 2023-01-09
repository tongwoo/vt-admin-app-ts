<!--用户-->
<template>
    <div class="form-container" v-loading="loading">
        <el-form ref="form" :model="model" :rules="rules" label-width="100px" size="default" @submit.prevent>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="model.username" maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleIds">
                <el-select v-model="model.roleIds" class="el-select-long" :multiple="true">
                    <el-option v-for="(item,i) in roles" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="model.id===null" label="登录密码" prop="password">
                <el-input v-model="model.password" maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="model.name" maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="state">
                <el-radio-group v-model="model.state">
                    <el-radio v-for="(item,i) in states" :key="i" :label="item.value">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <div class="error-container" v-if="tip">
                <el-alert type="error" :description="tip" :closable="false" show-icon></el-alert>
            </div>
            <div class="footer-container">
                <el-button type="default" @click="cancelBtnClick">取消</el-button>
                <el-button type="primary" @click="saveBtnClick" native-type="submit">保存</el-button>
            </div>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import {RoleModel, usePairRoles} from "@/modules/role"
import {ref, reactive, onMounted} from "vue"
import {ElLoading as loadingTip, ElMessage as messageTip, FormInstance} from "element-plus"
import {cloneObject, updateObject} from "@/utils/object"
import {httpErrorHandler} from "@/utils/error"
import moment from "moment"
import {getUserStates, USER_STATE_ENABLED} from "@/constants/user-state"
import {createUser, updateUser, fetchUser} from "@/modules/user"
import {ID, NameValue} from "@/types/built-in"

//属性
const props = withDefaults(
    defineProps<{
        //传递过来的数据
        payload: any
    }>(),
    {
        payload: () => {
            return {}
        }
    }
)

//状态列表
const states = ref(getUserStates())
//角色列表
const roles = usePairRoles()

//事件
const emits = defineEmits(['close'])
//加载中
const loading = ref<boolean>(false)
//表单
const form = ref<FormInstance>()
//错误信息
const tip = ref<string | null>(null)

//表单模型
const model = reactive({
    //主键
    id: null,
    //用户名
    username: null,
    //登录密码
    password: null,
    //姓名
    name: null,
    //头像
    avatar: null,
    //状态
    state: USER_STATE_ENABLED,
    //上次登录时间
    loginTime: null,
    //角色ID列表
    roleIds: [] as ID[]
})
//表单规则
const rules = {
    //用户名
    username: [
        {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '用户名必须填写'
        },
        {
            type: 'string',
            max: 32,
            trigger: 'blur',
            message: '用户名最多32个字符'
        }
    ],
    //角色
    roleIds: [
        {
            type: 'array',
            required: true,
            trigger: 'blur',
            message: '角色必须选择'
        }
    ],
    //登录密码
    password: [
        {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '登录密码必须填写'
        },
        {
            type: 'string',
            max: 64,
            trigger: 'blur',
            message: '登录密码最多64个字符'
        }
    ],
    //姓名
    name: [
        {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '姓名必须填写'
        },
        {
            type: 'string',
            max: 32,
            trigger: 'blur',
            message: '姓名最多32个字符'
        }
    ],
    //头像
    avatar: [
        {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '头像必须填写'
        },
        {
            type: 'string',
            max: 100,
            trigger: 'blur',
            message: '头像最多100个字符'
        }
    ],
    //状态
    state: [
        {
            type: 'integer',
            required: true,
            trigger: 'blur',
            message: '状态必须填写'
        },
        {
            type: 'integer',
            min: 0,
            max: 9,
            trigger: 'blur',
            message: '状态必须介于0-9之间'
        }
    ],
    //上次登录时间
    loginTime: [
        {
            type: 'object',
            required: true,
            trigger: 'blur',
            message: '上次登录时间必须选择'
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
    const data: Record<string, any> = {
        id: model.id, //ID
        username: model.username, //用户名
        password: model.password, //登录密码
        name: model.name, //姓名
        state: model.state, //状态
        roleIds: model.roleIds
    }
    //保存
    if (model.id) {
        delete data.password
        submitUpdate(data)
    } else {
        submitCreate(data)
    }
}

/**
 * 取消按钮点击
 */
const cancelBtnClick = () => {
    emits('close', 'cancel')
}

/**
 * 用户新增
 * @param data 新增的数据
 */
const submitCreate = (data: object) => {
    loading.value = true
    createUser(data).then((result) => {
        if (!result.success) {
            tip.value = result.message
            return
        }
        messageTip.success(result.message)
        emits('close', 'save')
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

/**
 * 用户更新
 * @param data 更新的数据
 */
const submitUpdate = (data: object) => {
    loading.value = true
    updateUser(data).then((result) => {
        if (!result.success) {
            tip.value = result.message
            return
        }
        messageTip.success(result.message)
        emits('close', 'save')
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

/**
 * 用户载入
 * @param id 主键ID
 */
const loadUser = (id: ID) => {
    loading.value = true
    fetchUser(id).then((data) => {
        if (!data) {
            messageTip.error('加载数据异常')
        } else {
            updateObject(model, data)
            model.roleIds = data.roles!.map(item => item.id)
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

onMounted(() => {
    if (props.payload?.id) {
        loadUser(props.payload.id)
    }
})
</script>
