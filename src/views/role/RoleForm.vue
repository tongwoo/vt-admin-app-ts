<!--角色-->
<template>
    <div class="form-container" v-loading="loading">
        <el-form ref="form" :model="model" :rules="rules" label-width="100px" size="default" @submit.prevent>
            <el-form-item label="角色名称" prop="name">
                <template v-slot:label>
                    <el-tooltip content="英文、下划线字符">
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
                <el-select v-model="model.ruleName" class="el-select-long" clearable>
                    <el-option v-for="(item,i) in ruleList" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否内置" prop="isBuiltIn">
                <el-switch v-model="model.isBuiltIn" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <div class="error-container" v-if="tip">
                <el-alert type="error" :description="tip" :closable="false" show-icon></el-alert>
            </div>
            <div class="footer-container">
                <el-button @click="onCancelBtnClick"><i class="bi bi-x-circle-fill el-icon--left"></i>取消</el-button>
                <el-button type="primary" @click="onSaveBtnClick" native-type="submit"><i class="bi bi-check-circle-fill el-icon--left"></i>保存</el-button>
            </div>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import {ref, reactive, onMounted, Ref} from "vue"
import {ID, Nullable} from "@/types/built-in.js"
import {ElMessage as messageTip,FormInstance, FormRules} from "element-plus"
import {updateObject} from "@/utils/object"
import {httpErrorHandler} from "@/utils/error"
import {useRules} from "@/modules/rbac"
import {createRole, updateRole, fetchRole, RoleModel} from "@/modules/role"

//事件
const emits = defineEmits(['close'])

//属性
const props = withDefaults(
    defineProps<{
        //传递过来的数据
        payload: any
    }>(),
    {}
)

//规则列表
const ruleList = useRules()

//加载中
const loading: Ref<boolean> = ref(false)
//表单
const form: Ref<FormInstance | null> = ref(null)
//错误信息
const tip: Ref<string | null> = ref(null)

//表单模型
const model: Nullable<RoleModel> = reactive({
    id: null,
    //角色名称
    name: null,
    //角色描述
    description: null,
    //规则名称
    ruleName: null,
    //是否内置
    isBuiltIn: 0
})

//表单规则
const rules: FormRules = {
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
            required: true,
            trigger: 'blur',
            message: '规则名称必须选择'
        }
    ],
    //是否内置
    isBuiltIn: [
        {
            type: 'integer',
            required: true,
            trigger: 'blur',
            message: '是否内置必须选择'
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
    const data: Record<string, any> = {
        id: model.id, //ID
        name: model.name, //角色名称
        description: model.description, //角色描述
        ruleName: model.ruleName, //规则名称
        isBuiltIn: model.isBuiltIn //是否内置
    }
    //保存
    if (model.id) {
        submitUpdate(data)
    } else {
        submitCreate(data)
    }
}

/**
 * 取消按钮点击
 */
const onCancelBtnClick = () => {
    emits('close', 'cancel')
}

/**
 * 角色新增
 * @param data 新增的数据
 */
const submitCreate = (data: any) => {
    loading.value = true
    createRole(data).then((result) => {
        if (!result.success) {
            tip.value = result.message
        } else {
            messageTip.success(result.message)
            emits('close', 'save')
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

/**
 * 角色更新
 * @param data 更新的数据
 */
const submitUpdate = (data: any) => {
    loading.value = true
    updateRole(data).then((result) => {
        if (!result.success) {
            tip.value = result.message
        } else {
            messageTip.success(result.message)
            emits('close', 'save')
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

/**
 * 载入角色
 * @param id 主键ID
 */
const loadRole = (id: ID) => {
    loading.value = true
    fetchRole(id).then((data) => {
        if (!data) {
            messageTip.error('加载数据异常')
        } else {
            updateObject(model, data)
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

onMounted(() => {
    if (props.payload && props.payload?.id) {
        loadRole(props.payload.id)
    }
})
</script>
