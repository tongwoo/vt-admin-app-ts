<!--
功能：路由表单
作者：wutong
日期：2022-11-03
-->
<template>
    <div class="form-container" v-loading="loading">
        <el-form ref="form" :model="model" :rules="rules" label-width="60px" size="default" @submit.prevent>
            <el-form-item label="权限" prop="permissionId">
                <el-select v-model="model.permissionId" class="el-select-long" filterable>
                    <el-option v-for="(item,i) in permissions" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="model.name" maxlength="128"></el-input>
            </el-form-item>
            <el-form-item label="路径" prop="path">
                <el-input v-model="model.path" maxlength="256"></el-input>
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
import {ref, reactive, onMounted} from "vue"
import {ElLoading as loadingTip, ElMessage as messageTip, FormInstance} from "element-plus"
import {cloneObject, updateObject} from "@/utils/object"
import {httpErrorHandler} from "@/utils/error"
import moment from "moment"
import {usePairPermissions} from "@/modules/permission"
import {createRoute, updateRoute, fetchRoute} from "@/modules/route"
import {ID, NameValue} from "@/types/built-in"

//属性
const props = withDefaults(defineProps<{
    //传递过来的数据
    payload: any
}>(), {
    payload: () => {
        return {}
    }
})

//权限列表
const permissions = usePairPermissions()

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
    //权限
    permissionId: null,
    //名称
    name: null,
    //路径
    path: null
})
//表单规则
const rules = {
    //权限
    permissionId: [
        {
            type: 'integer',
            required: true,
            trigger: 'blur',
            message: '权限必须选择'
        },
        {
            type: 'integer',
            min: 0,
            max: 9999999999,
            trigger: 'blur',
            message: '权限必须介于0-9999999999之间'
        }
    ],
    //名称
    name: [
        {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '名称必须填写'
        },
        {
            type: 'string',
            max: 128,
            trigger: 'blur',
            message: '名称最多128个字符'
        }
    ],
    //路径
    path: [
        {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '路径必须填写'
        },
        {
            type: 'string',
            max: 256,
            trigger: 'blur',
            message: '路径最多256个字符'
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
    const data = {
        id: model.id, //ID
        permissionId: model.permissionId, //权限
        name: model.name, //名称
        path: model.path //路径
    }
    //保存
    if (data?.id) {
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
 * 路由新增
 * @param data 新增的数据
 */
const submitCreate = (data: object) => {
    loading.value = true
    createRoute(data).then(({success, message}) => {
        if (!success) {
            tip.value = message
            return
        }
        messageTip.success(message)
        emits('close', 'save')
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

/**
 * 路由更新
 * @param data 更新的数据
 */
const submitUpdate = (data: object) => {
    loading.value = true
    updateRoute(data).then(({success, message}) => {
        if (!success) {
            tip.value = message
            return
        }
        messageTip.success(message)
        emits('close', 'save')
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

/**
 * 路由载入
 * @param id 主键ID
 */
const loadRoute = (id: ID) => {
    loading.value = true
    fetchRoute(id).then((data) => {
        if (!data) {
            messageTip.error('加载失败')
        } else {
            updateObject(model, data)
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

onMounted(async () => {
    if (props.payload?.id) {
        await loadRoute(props.payload.id)
    }
})
</script>
