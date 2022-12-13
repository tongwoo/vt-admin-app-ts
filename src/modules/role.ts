/*
 * 角色
*/
import {onMounted, Ref, ref} from "vue"
import {http, HttpResponse} from "@/utils/http"
import {ID, NameValue, PageResult, Model} from "@/types/built-in"
import {PermissionModel} from './permission'

/**
 * 角色模型
 */
export interface RoleModel extends Model {
    //角色名称
    name: string,
    //角色描述
    description: string,
    //规则名称
    ruleName: string,
    //是否内置
    isBuiltIn: number,
    //角色权限列表
    permissions?: PermissionModel[]
}

/**
 * 将原始数据转换成角色模型
 * @param data 要转换的数据
 */
export function dataToRoleModel(data: any): RoleModel {
    return {
        //原数据
        _: data,
        //ID
        id: data.id,
        //角色名称
        name: data.name,
        //角色描述
        description: data.description,
        //规则名称
        ruleName: data.ruleName,
        //是否内置
        isBuiltIn: data.isBuiltIn
    }
}

/**
 * 新增角色
 * @param data 数据
 */
export function createRole(data: object): Promise<HttpResponse> {
    return http.post(
        '/role/create',
        data
    ).then((response) => {
        const result = response.data
        return {
            success: response.isOk,
            message: result.message
        }
    })
}

/**
 * 更新角色
 * @param data 数据
 */
export function updateRole(data: object): Promise<HttpResponse> {
    return http.post(
        '/role/update',
        data
    ).then((response) => {
        const result = response.data
        return {
            success: response.isOk,
            message: result.message
        }
    })
}

/**
 * 删除角色
 * @param ids 数据ID
 */
export function removeRole(ids: ID | ID[]): Promise<HttpResponse> {
    return http.post(
        '/role/delete',
        {
            ids
        }
    ).then((response) => {
        const result = response.data
        return {
            success: response.isOk,
            message: result.message
        }
    })
}

/**
 * 获取角色详情
 * @param id 主键ID
 */
export function fetchRole(id: ID): Promise<RoleModel | null> {
    return http.get(
        '/role/detail?id=' + id
    ).then((response) => {
        return response.isOk ? dataToRoleModel(response.data.data.item) : null
    })
}

/**
 * 获取角色列表
 * @param params 查询参数
 */
export function fetchRoles(params: Record<string, any> = {}): Promise<RoleModel[]> {
    return http.get(
        '/role/items',
        {
            params
        }
    ).then((response) => {
        const result = response.data
        if (!response.isOk) {
            return []
        }
        return result.data.items.map((item: any) => {
            return dataToRoleModel(item)
        })
    })
}

/**
 * 获取分页之后的角色列表
 * @param params 查询参数
 */
export function fetchPageRoles(params: Record<string, any> = {}): Promise<PageResult<RoleModel>> {
    return http.get(
        '/role/page-items',
        {
            params
        }
    ).then((response) => {
        const result = response.data
        const data = {
            items: [] as RoleModel[],
            total: 0
        }
        if (response.isOk) {
            data.items = result.data.items.map((item: any) => {
                return dataToRoleModel(item)
            })
            data.total = result.data.total
        }
        return data
    })
}

/**
 * 获取角色键值对列表
 * @param params 查询参数
 */
export function fetchPairRoles(params: Record<string, any> = {}): Promise<NameValue[]> {
    return fetchRoles(params).then((items) => {
        return items.map((item) => {
            return {
                name: item.name,
                value: item.id
            }
        })
    })
}


/**
 * 使用角色列表
 * @param params 查询参数
 */
export function useRoles(params: Record<string, any> = {}): Ref<RoleModel[]> {
    const roles = ref<RoleModel[]>([])
    onMounted(async () => {
        roles.value = await fetchRoles(params)
    })
    return roles
}

/**
 * 使用角色名称值列表
 * @param params 查询参数
 */
export function usePairRoles(params: Record<string, any> = {}): Ref<NameValue[]> {
    const roles = ref<NameValue[]>([])
    onMounted(async () => {
        roles.value = await fetchPairRoles(params)
    })
    return roles
}

/**
 * 角色权限列表
 * @param roleId 角色ID
 */
export function fetchRolePermissions(roleId: ID): Promise<Array<PermissionModel>> {
    return http.get(
        '/role/permissions?id=' + roleId
    ).then((response) => {
        if (!response.isOk) {
            return []
        }
        return response.data.data.items
    })
}
