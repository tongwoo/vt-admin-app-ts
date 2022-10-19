<!--
功能：角色表单
作者：wutong
日期：2022-10-19
-->
<template>
    <div class="form-container" v-loading="loading">
        <el-form ref="form" :model="model" :rules="rules" label-width="100px" size="default" @submit.prevent>
            <el-form-item label="角色名称" prop="name">
                <template v-slot:label>
                    <el-tooltip content="需要英文、下划线字符">
                        <i class="bi bi-question-circle el-icon--left"></i>
                    </el-tooltip>
                    角色名称
                </template>
                <el-input v-model="model.name" maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
                <el-input v-model="model.description" maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="规则名称" prop="ruleName">
                <el-input v-model="model.ruleName" maxlength="50"></el-input>
            </el-form-item>
            <!--
            <el-form-item label="是否内置" prop="isBuiltIn">
                <el-select v-model="model.isBuiltIn" class="el-select-long">
                    <el-option v-for="(item,i) in isBuiltIns" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            -->
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
import {getConfirms} from "@/constants/confirm"
import {createRole, updateRole, fetchRole} from "@/modules/role"
import {ID, NameValue} from "@/types/built-in"

//属性
const props = defineProps({
    //传递过来的数据
    payload: {
        type: Object
    }
})
//事件
const emits = defineEmits(['close'])
//加载中
const loading = ref(false)
//表单
const form = ref<FormInstance>()
//错误信息
const tip = ref<string | null>(null)
//是否内置列表
const isBuiltIns = ref(getConfirms())

//模型
const model = reactive({
    //主键
    id: null,
    //角色名称
    name: null,
    //角色描述
    description: null,
    //规则名称
    ruleName: null,
    //是否内置
    isBuiltIn: null
})
//规则
const rules = {
    //角色名称
    name: [
        {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '角色名称必须填写'
        },
        {
            type: 'string',
            max: 32,
            trigger: 'blur',
            message: '角色名称最多32个字符'
        }
    ],
    //角色描述
    description: [
        {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '角色描述必须填写'
        },
        {
            type: 'string',
            max: 32,
            trigger: 'blur',
            message: '角色描述最多32个字符'
        }
    ],
    //规则名称
    ruleName: [
        {
            type: 'string',
            required: false,
            trigger: 'blur',
            message: '规则名称必须填写'
        },
        {
            type: 'string',
            max: 50,
            trigger: 'blur',
            message: '规则名称最多50个字符'
        }
    ],
    //是否内置
    isBuiltIn: [
        {
            type: 'integer',
            required: false,
            trigger: 'blur',
            message: '是否内置必须填写'
        },
        {
            type: 'integer',
            min: 0,
            max: 255,
            trigger: 'blur',
            message: '是否内置必须介于0-255之间'
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
        name: model.name, //角色名称
        description: model.description, //角色描述
        ruleName: model.ruleName, //规则名称
        isBuiltIn: model.isBuiltIn //是否内置
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
 * 角色新增
 * @param data 新增的数据
 */
const submitCreate = (data: object) => {
    loading.value = true
    return createRole(data).then(({success, message}) => {
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
 * 角色更新
 * @param data 更新的数据
 */
const submitUpdate = (data: object) => {
    loading.value = true
    return updateRole(data).then(({success, message}) => {
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
 * 角色载入
 * @param id 主键ID
 */
const loadRole = (id: ID) => {
    loading.value = true
    return fetchRole(id).then((body) => {
        if (!body.success) {
            messageTip.error(body.message)
            return
        }
        const data = body.data
        updateObject(model, data)
        /*
        //更新模型
        model.id = data.id; //ID
        model.name : data.name, //角色名称
        model.description : data.description, //角色描述
        model.ruleName : data.ruleName, //规则名称
        model.isBuiltIn : data.isBuiltIn, //是否内置
        */
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

onMounted(async () => {
    if (props.payload?.id) {
        await loadRole(props.payload.id)
    }
})
</script>
