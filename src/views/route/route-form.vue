<!--路由-->
<template>
    <div class="form-container" v-loading="loading">
        <el-form ref="form" :model="model" :rules="rules" label-width="60px" size="default" @submit.prevent>
            <el-form-item label="权限" prop="permissionId">
                <div class="form-item-auto">
                    <el-select v-model="model.permissionId" class="el-select-long">
                        <el-option v-for="(item,i) in permissions" :key="i" :label="item.description" :value="item.id"></el-option>
                    </el-select>
                </div>
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
                <el-button :icon="CircleCloseFilled" @click="onCancelBtnClick">取消</el-button>
                <el-button type="primary" :icon="CircleCheckFilled" @click="onSaveBtnClick" native-type="submit">保存</el-button>
            </div>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import {ref, reactive, onMounted, Ref} from "vue"
import {ID, NameValue, Nullable} from "@/types/built-in.js"
import {ElMessage as messageTip, FormInstance, FormRules} from "element-plus"
import {CircleCheckFilled, CircleCloseFilled} from "@element-plus/icons-vue"
import {updateObject} from "@/utils/object"
import {httpErrorHandler} from "@/utils/error"
import {usePermissions} from "@/modules/permission"
import {createRoute, updateRoute, fetchRoute, Route} from "@/modules/route"

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


//权限列表
const {permissions} = usePermissions()

//加载中
const loading: Ref<boolean> = ref(false)
//表单
const form: Ref<FormInstance | null> = ref(null)
//错误信息
const tip: Ref<string | null> = ref(null)

//表单模型接口
interface RouteFormModel {
    //主键
    id: ID | null,
    //权限
    permissionId: number | null,
    //名称
    name: string | null,
    //路径
    path: string | null,
}

//表单模型
const model: RouteFormModel = reactive({
    id: null,
    permissionId: null,
    name: null,
    path: null
})
//表单规则
const rules: FormRules = {
    //权限
    permissionId: [
        {
            type: 'integer',
            required: true,
            trigger: 'blur',
            message: '权限必须选择'
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
const onSaveBtnClick = async () => {
    tip.value = null
    const success = await form.value!.validate().catch(() => false)
    if (!success) {
        return
    }
    const data: Record<string, any> = {
        id: model.id, //ID
        permissionId: model.permissionId, //权限
        name: model.name, //名称
        path: model.path //路径
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
 * 路由新增
 * @param data 新增的数据
 */
const submitCreate = (data: any) => {
    loading.value = true
    createRoute(data).then((result) => {
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
 * 路由更新
 * @param data 更新的数据
 */
const submitUpdate = (data: any) => {
    loading.value = true
    updateRoute(data).then((result) => {
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
 * 载入路由
 * @param id 主键ID
 */
const loadRoute = (id: ID) => {
    loading.value = true
    fetchRoute(id).then((data) => {
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
        loadRoute(props.payload.id)
    }
})
</script>
