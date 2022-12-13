<!--
功能：角色
作者：wutong
日期：2022-10-19
-->
<template>
    <div class="page-container">
        <div class="page-segment">
            <div class="segment-header with-bordered">
                <div class="header-title">查询</div>
            </div>
            <div class="segment-body">
                <div class="query-container">
                    <div class="form-container margin-none">
                        <el-form size="default" inline @submit.prevent>
                            <el-form-item label="角色名称">
                                <el-input v-model="query.name" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="角色描述">
                                <el-input v-model="query.description" clearable></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitQuery" native-type="submit"><i class="bi bi-search el-icon--left"></i>查询</el-button>
                                <el-button type="default" @click="resetQuery"><i class="bi bi-arrow-clockwise el-icon--left"></i>重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-segment">
            <div class="segment-header with-bordered with-flex">
                <div class="header-title">角色列表</div>
                <div class="header-buttons">
                    <el-button type="primary" size="default" @click="createBtnClick"><i class="bi bi-plus-lg el-icon--left"></i>新增</el-button>
                    <el-button type="danger" size="default" @click="batchRemoveBtnClick"><i class="bi bi-trash el-icon--left"></i>删除</el-button>
                </div>
            </div>
            <div class="segment-body">
                <!--数据列表-->
                <div class="data-container">
                    <div class="data-table">
                        <el-table ref="table" border stripe size="small" row-key="id" :data="record.items" v-loading="record.loading" selection-change="selectionChange">
                            <el-table-column type="selection" fixed="left" align="center"></el-table-column>
                            <el-table-column type="index" fixed="left" label="序号" align="center"></el-table-column>
                            <el-table-column prop="name" label="角色名称" align="center" min-width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="description" label="角色描述" align="center" min-width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="ruleName" label="规则名称" align="center" min-width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="isBuiltInName" label="是否内置" align="center" min-width="100" show-overflow-tooltip>
                                <template v-slot="{row}">
                                    <div :class="row.isBuiltInClass">{{ row.isBuiltInName }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width="180" align="center">
                                <template v-slot="{row}">
                                    <div class="table-operation">
                                        <el-button type="primary" size="small" text bg @click="permissionBtnClick(row)">权限</el-button>
                                        <el-button type="primary" size="small" text bg @click="modifyBtnClick(row)">修改</el-button>
                                        <el-button type="danger" size="small" text bg @click="removeBtnClick(row)">删除</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <!--数据分页-->
                <div class="pagination-container">
                    <el-pagination v-model:page-size="record.size" v-model:current-page="query.page" :total="record.total" @current-change="pageChange" background></el-pagination>
                </div>
            </div>
        </div>
        <!--维护表单弹框-->
        <el-dialog :title="maintain.dialog.title" v-model="maintain.dialog.show" :close-on-click-modal="false" @close="maintainDialogClose" append-to-body width="500px">
            <transition name="el-fade-in" mode="out-in">
                <role-form v-if="maintain.dialog.show" :payload="maintain.data" @close="maintainDialogClose"></role-form>
            </transition>
        </el-dialog>
        <!--角色权限表单弹框-->
        <el-dialog :title="permission.dialog.title" v-model="permission.dialog.show" :close-on-click-modal="false" append-to-body width="500px">
            <transition name="el-fade-in" mode="out-in">
                <role-permission-form v-if="permission.dialog.show" :payload="permission.data" @close="permissionDialogClose"></role-permission-form>
            </transition>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import {DialogOption, ID, RecordSet} from "@/types/built-in.js"
import {defineAsyncComponent, onMounted, reactive, ref} from "vue"
import {ElLoading as loadingTip, ElMessage as messageTip, ElMessageBox as messageBox, ElTable} from "element-plus"
import {cloneObject} from "@/utils/object"
import {httpErrorHandler} from "@/utils/error"
import setting from "@/setting"
import {getConfirmClass, getConfirmName, getConfirms} from "@/constants/confirm"
import {fetchPageRoles, removeRole, RoleModel} from "@/modules/role"

//角色表单
const RoleForm = defineAsyncComponent(() => import('@/views/role/RoleForm.vue'))
const RolePermissionForm = defineAsyncComponent(() => import('@/views/role/RolePermissionForm.vue'))

//是否内置列表
const isBuiltIns = ref(getConfirms())

onMounted(() => {
    //载入角色
    loadRoles()
})

/**
 * 查询参数
 */
const query = reactive({
    //页码
    page: 1,
    //角色名称
    name: null,
    //角色描述
    description: null,
    //规则名称
    ruleName: null,
    //是否内置
    isBuiltIn: null
})

type QueryType = keyof typeof query

/**
 * 构建查询参数
 */
const buildQuery = () => {
    return {
        //当前页码
        page: query.page,
        //每页记录数
        pageSize: record.size,
        //角色名称
        name: query.name,
        //角色描述
        description: query.description,
    }
}

/**
 * 提交查询
 */
const submitQuery = () => {
    query.page = 1
    loadRoles()
}

/**
 * 重置查询
 */
const resetQuery = () => {
    Object.keys(query).forEach((key) => {
        query[key as Exclude<QueryType, 'page'>] = null
    })
    query.page = 1
    loadRoles()
}

/**
 * 权限
 */
const permission: DialogOption = {
    //传递给表单的数据
    data: null,
    //弹框
    dialog: reactive({
        show: false,
        title: null
    })
}

/**
 * 权限按钮点击
 * @param row 当前行数据
 */
const permissionBtnClick = (row: RoleModel) => {
    permission.data = row
    permission.dialog.show = true
    permission.dialog.title = '权限'
}

/**
 * 权限弹框关闭
 * @param payload 返回的数据
 */
const permissionDialogClose = (payload: any) => {
    permission.dialog.show = false
}

/**
 * 维护
 */
const maintain: DialogOption = reactive({
    //传递给表单的数据
    data: null,
    //弹框
    dialog: {
        show: false,
        title: ''
    }
})

/**
 * 弹框关闭
 * @param payload 返回的数据
 */
const maintainDialogClose = (payload: any) => {
    maintain.dialog.show = false
    if (payload === 'save') {
        loadRoles()
    }
}

/**
 * 新增按钮点击
 */
const createBtnClick = () => {
    maintain.data = null
    maintain.dialog.show = true
    maintain.dialog.title = '新增角色'
}

/**
 * 编辑按钮点击
 * @param row 当前行数据
 */
const modifyBtnClick = (row: object) => {
    maintain.data = cloneObject(row)
    maintain.dialog.show = true
    maintain.dialog.title = '编辑角色'
}

/**
 * 单个删除按钮点击
 * @param {Object} row 当前行数据
 */
const removeBtnClick = (row: RoleModel) => {
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
const batchRemoveBtnClick = () => {
    if (record.selected.length === 0) {
        messageTip.error('请选择要删除的数据')
        return
    }
    messageBox.confirm('确定删除吗？删除后无法恢复', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        const ids = record.selected.map((item) => {
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
    return removeRole(ids).then(({success, message}) => {
        if (!success) {
            messageTip.error(message)
        } else {
            messageTip.success(message)
            record.selected = []
            loadRoles()
        }
    }).catch(httpErrorHandler).finally(() => {
        loading.close()
    })
}

/**
 * 记录集
 */
const record = reactive<RecordSet<RoleModel>>({
    total: 0,
    loading: false,
    size: setting.pagination.size,
    items: [],
    selected: []
})

//表格ref
const table = ref<InstanceType<typeof ElTable>>()

/**
 * 表格复选框选中状态变更
 * @param records 已选中的复选框数据
 */
const selectionChange = (records: RoleModel[]) => {
    record.selected = records
}

/**
 * 分页变更
 * @param page 改变后的页码
 */
const pageChange = (page: number) => {
    query.page = page
    loadRoles()
}

/**
 * 加载角色列表
 * @return {Promise}
 */
const loadRoles = () => {
    const params = buildQuery()
    record.loading = true
    return fetchPageRoles(params).then((data) => {
        if (data.items.length === 0 && query.page > 1) {
            query.page -= 1
            loadRoles()
            return
        }
        record.total = data.total
        record.items = data.items
    }).catch(httpErrorHandler).finally(() => {
        record.loading = false
    })
}

onMounted(() => {
    //载入角色
    loadRoles()
})

</script>
<style lang="scss" scoped>
/**
 * 是否内置
 */
.confirm-yes {
    color: #409EFF;
}

.confirm-no {
    color: #F56C6C;
}

</style>
