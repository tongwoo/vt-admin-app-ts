<!--权限-->
<template>
    <div class="form-container" v-loading="loading">
        <el-form ref="form" :model="model" :rules="rules" label-width="100px" size="default" @submit.prevent>
            <el-form-item label="父权限" prop="parentId">
                <el-tree-select node-key="id" v-model="model.parentId" :data="parents" class="el-select-long" :props="{value:'id',label:'description'}" check-strictly :render-after-expand="false"></el-tree-select>
            </el-form-item>
            <el-form-item label="权限名称" prop="name">
                <el-input v-model="model.name" maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="权限描述" prop="description">
                <el-input v-model="model.description" maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="规则名称" prop="ruleName">
                <el-select v-model="model.ruleName" class="el-select-long">
                    <el-option v-for="(item,i) in ruleNames" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="model.id===null">
                <el-checkbox v-model="model.include">额外创建「增删改查」子权限</el-checkbox>
            </el-form-item>
            <div class="error-container" v-if="tip">
                <el-alert type="error" :description="tip" :closable="false" show-icon></el-alert>
            </div>
            <div class="footer-container">
                <el-button :icon="CircleCloseFilled" @click="onCancelBtnClick">取消</el-button>
                <el-button type="primary" :icon="CircleCheckFilled" @click="onSaveBtnClick" native-type="submit">保存</el-button>
            </div>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import {ref, reactive, onMounted, Ref} from "vue"
import {ID, PropNullable} from "@/types/built-in"
import {ElMessage as messageTip, FormInstance, FormRules} from "element-plus"
import {CircleCheckFilled, CircleCloseFilled} from "@element-plus/icons-vue"
import {updateObject} from "@/utils/object"
import {httpErrorHandler} from "@/utils/error"
import {createPermission, updatePermission, fetchPermission, usePermissionTree, PermissionModel} from "@/modules/permission"
import {useRules} from "@/modules/rbac"

//事件
const emit = defineEmits<{
    (event: 'close', payload: any): void
}>()

//属性
const props = withDefaults(
    defineProps<{
        //传递过来的数据
        payload: any
    }>(),
    {}
)

//父权限列表
const parents = usePermissionTree()

//规则列表
const ruleNames = useRules()

//加载中
const loading: Ref<boolean> = ref(false)
//表单
const form: Ref<FormInstance | null> = ref(null)
//错误信息
const tip: Ref<string | null> = ref(null)

//表单模型接口
interface PermissionFormModel {
    //主键
    id: ID | null,
    //父权限
    parentId: number | null,
    //权限名称
    name: string | null,
    //权限描述
    description: string | null,
    //规则名称
    ruleName: string | null,
    //是否创建增删改查
    include: boolean
}

//表单模型
const model: PermissionFormModel = reactive({
    id: null,
    parentId: null,
    name: null,
    description: null,
    ruleName: null,
    include: false
})

//表单规则
const rules: FormRules = {
    //父权限
    parentId: [
        {
            type: 'integer',
            required: true,
            trigger: 'blur',
            message: '父权限必须选择'
        }
    ],
    //权限名称
    name: [
        {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '权限名称必须填写'
        },
        {
            type: 'string',
            max: 32,
            trigger: 'blur',
            message: '权限名称最多32个字符'
        }
    ],
    //权限描述
    description: [
        {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '权限描述必须填写'
        },
        {
            type: 'string',
            max: 32,
            trigger: 'blur',
            message: '权限描述最多32个字符'
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
        parentId: model.parentId, //父权限
        name: model.name, //权限名称
        description: model.description, //权限描述
        ruleName: model.ruleName, //规则名称
        include: model.include
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
    emit('close', 'cancel')
}

/**
 * 权限新增
 * @param data 新增的数据
 */
const submitCreate = (data: any) => {
    loading.value = true
    createPermission(data).then((result) => {
        if (!result.success) {
            tip.value = result.message
        } else {
            messageTip.success(result.message)
            emit('close', 'save')
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

/**
 * 权限更新
 * @param data 更新的数据
 */
const submitUpdate = (data: any) => {
    loading.value = true
    updatePermission(data).then((result) => {
        if (!result.success) {
            tip.value = result.message
        } else {
            messageTip.success(result.message)
            emit('close', 'save')
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
}

/**
 * 载入权限
 * @param id 主键ID
 */
const loadPermission = (id: ID) => {
    loading.value = true
    fetchPermission(id).then((data) => {
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
        loadPermission(props.payload.id)
    } else if (props.payload?.clone) {
        model.parentId = props.payload.parentId
    }
})
</script>
