<!--权限-->
<template>
    <div class="page-container">
        <div class="page-segment">
            <div class="segment-header with-bordered with-flex">
                <div class="header-title">权限列表</div>
                <div class="header-buttons">
                    <el-button type="primary" size="default" @click="onCreateBtnClick"><i class="bi bi-plus-lg el-icon--left"></i>新增</el-button>
                    <el-button type="danger" size="default" @click="onBatchRemoveBtnClick"><i class="bi bi-trash el-icon--left"></i>删除</el-button>
                </div>
            </div>
            <div class="segment-body">
                <!--数据列表-->
                <div class="data-container">
                    <div class="data-table">
                        <el-table ref="table" border stripe size="small" row-key="id" :data="record.items" v-loading="record.loading" @selection-change="onSelectionChange">
                            <el-table-column type="selection" fixed="left" align="center"></el-table-column>
                            <el-table-column label="权限描述" prop="description" align="left" min-width="300" show-overflow-tooltip></el-table-column>
                            <el-table-column label="权限名称" prop="name" align="center" min-width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column label="规则名称" prop="ruleName" align="center" min-width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作" fixed="right" width="220" align="center">
                                <template v-slot="{row}">
                                    <div class="table-operation">
                                        <el-button type="primary" size="small" @click="onNewBtnClick(row)">新增子权限</el-button>
                                        <el-button type="primary" size="small" @click="onModifyBtnClick(row)">修改</el-button>
                                        <el-button type="danger" size="small" @click="onRemoveBtnClick(row)">删除</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <!--维护表单弹框-->
        <el-dialog :title="maintain.dialog.title" v-model="maintain.dialog.show" :close-on-click-modal="false" @close="onMaintainDialogClose" append-to-body width="500px">
            <transition name="el-fade-in" mode="out-in">
                <permission-form v-if="maintain.dialog.show" :payload="maintain.data" @close="onMaintainDialogClose"></permission-form>
            </transition>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import moment from "moment"
import {QueryParam, ID, RecordSet, NameValue, DialogOption, PageResult, Nullable} from "@/types/built-in.js"
import {HttpResponse} from "@/utils/http"
import {ref, reactive, Ref, onMounted, defineAsyncComponent} from "vue"
import {ElLoading as loadingTip, ElMessage as messageTip, ElMessageBox as messageBox, ElTable} from "element-plus"
import {cloneObject} from "@/utils/object"
import {httpErrorHandler} from "@/utils/error"
import setting from "@/setting"
import {PermissionModel, removePermission, fetchPagePermissions, fetchPermissionTree} from "@/modules/permission"

//权限表单
const PermissionForm = defineAsyncComponent(() => import('./PermissionForm.vue'))


onMounted(() => {
    //载入权限
    loadPermissions()
})

/**
 * 维护
 */
const maintain: {
    //传递给表单的数据
    data: any,
    //弹框
    dialog: DialogOption
} = reactive({
    data: null,
    dialog: {
        show: false,
        title: ''
    }
})

/**
 * 弹框关闭
 * @param payload 返回的数据
 */
const onMaintainDialogClose = (payload: any) => {
    maintain.dialog.show = false
    if (payload === 'save') {
        loadPermissions()
    }
}

/**
 * 新增按钮点击
 */
const onCreateBtnClick = () => {
    maintain.data = null
    maintain.dialog.show = true
    maintain.dialog.title = '新增权限'
}

/**
 * 新增子权限按钮点击
 */
const onNewBtnClick = (row: PermissionModel) => {
    maintain.data = {
        clone: true,
        parentId: row.id
    }
    maintain.dialog.show = true
    maintain.dialog.title = '新增权限'
}

/**
 * 修改按钮点击
 * @param row 当前行数据
 */
const onModifyBtnClick = (row: PermissionModel) => {
    maintain.data = cloneObject(row)
    maintain.dialog.show = true
    maintain.dialog.title = '修改权限'
}

/**
 * 单个删除按钮点击
 * @param row 当前行数据
 */
const onRemoveBtnClick = (row: PermissionModel) => {
    messageBox.confirm('确定删除吗？删除后无法恢复', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        submitRemove(row.id)
    }).catch(() => {
        //...
    })
}

/**
 * 批量删除按钮点击
 */
const onBatchRemoveBtnClick = () => {
    if (record.selected!.length === 0) {
        messageTip.error('请选择要删除的数据')
        return
    }
    messageBox.confirm('确定删除吗？删除后无法恢复', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        const ids = record.selected!.map((item) => {
            return item.id
        }).join(',')
        submitRemove(ids)
    }).catch(() => {
        //...
    })
}

/**
 * 提交删除
 * @param ids 要删除的ID
 */
const submitRemove = (ids: ID | ID[]) => {
    const loading = loadingTip.service({
        lock: true,
        text: '删除中'
    })
    removePermission(ids).then((result) => {
        if (!result.success) {
            messageTip.error(result.message)
        } else {
            messageTip.success(result.message)
            record.selected = []
            loadPermissions()
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.close()
    })
}

/**
 * 记录集
 */
const record: RecordSet<PermissionModel> = reactive({
    total: 0,
    loading: false,
    size: setting.pagination.size,
    items: [],
    selected: []
})

//表格ref
const table: Ref<InstanceType<typeof ElTable> | null> = ref(null)

/**
 * 表格复选框选中状态变更
 * @param records 已选中的复选框数据
 */
const onSelectionChange = (records: PermissionModel[]) => {
    record.selected = records
}

/**
 * 加载权限列表
 */
const loadPermissions = () => {
    record.loading = true
    fetchPermissionTree().then((items) => {
        record.items = items
    }).catch(httpErrorHandler).finally(() => {
        record.loading = false
    })
}
</script>
<style lang="scss" scoped>
</style>
