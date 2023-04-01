<template>
    <div class="form-container" v-loading="loading">
        <el-tree class="permission-box" v-if="permissions.length>0" ref="tree" :props="treeProps" node-key="id" :data="permissions" show-checkbox accordion></el-tree>
        <el-empty v-else></el-empty>
        <div class="error-container" v-if="tip">
            <el-alert type="error" :description="tip" :closable="false" show-icon></el-alert>
        </div>
        <div class="footer-container" v-if="permissions.length>0">
            <el-button :icon="CircleCloseFilled" @click="onCancelBtnClick">取消</el-button>
            <el-button type="primary" :icon="CircleCheckFilled" @click="onSaveBtnClick" native-type="submit">保存</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref} from "vue"
import {http} from "@/utils/http"
import {ElMessage as messageTip, ElTree} from "element-plus"
import {CircleCheckFilled,CircleCloseFilled} from "@element-plus/icons-vue"
import {httpErrorHandler} from "@/utils/error"
import {fetchPermissionTree, PermissionTree} from "@/modules/permission"
import {fetchRolePermissions} from "@/modules/role"

//属性
const props = defineProps({
    //传递过来的数据
    payload: {
        type: Object
    }
})

//事件
const emit = defineEmits<{
    (event: 'close', payload?: any): void
}>()

//加载中
const loading = ref(false)
//权限树
const tree = ref<InstanceType<typeof ElTree>>()
//错误
const tip = ref<string | null>(null)
//权限集合
const permissions = ref<PermissionTree[]>([])
//权限树选项
const treeProps = {
    value: 'id',
    label: 'description',
    children: 'children'
}

/**
 * 初始化
 */
onMounted(async () => {
    loading.value = true
    Promise.all([
        //载入所有权限（嵌套结构）
        await loadPermissions(),
        //载入此角色拥有的权限列表（平级结构）
        await loadRolePermissions()
    ]).catch(httpErrorHandler).finally(() => {
        loading.value = false
    })
})

/**
 * 加载所有权限列表
 */
const loadPermissions = () => {
    return fetchPermissionTree().then((items) => {
        permissions.value = items
    })
}

/**
 * 加载角色拥有的权限列表
 */
const loadRolePermissions = () => {
    return fetchRolePermissions(props.payload!.id).then((items) => {
        nextTick(() => {
            //需要循环调用设置每个复选框的选中情况
            items.forEach((item) => {
                tree.value!.setChecked(item.id, true, false)
            })
        })
    })
}

/**
 * 提交保存
 */
const submitSave = (data: object) => {
    tip.value = null
    loading.value = true
    return http.post(
        '/role/bind',
        data
    ).then((response) => {
        if (!response.isOk) {
            tip.value = response.data.message
        } else {
            messageTip.success(response.data.message)
            emit('close')
        }
    }).finally(() => {
        loading.value = false
    })
}

/**
 * 保存按钮点击
 */
const onSaveBtnClick = () => {
    //选中的
    const keys = tree.value!.getCheckedKeys()
    //半选中的（服务端如不要则移除）
    const halfKeys = tree.value!.getHalfCheckedKeys()
    //两者合并
    const permissionIds = [...keys, ...halfKeys]
    //提交保存
    submitSave({
        id: props.payload!.id,
        permissions: permissionIds
    })
}

/**
 * 取消保存按钮点击
 */
const onCancelBtnClick = () => {
    emit('close')
}
</script>

<style lang="scss" scoped>
.permission-box {
    border: 1px solid #eee;
    margin-bottom: 10px;
}
</style>
