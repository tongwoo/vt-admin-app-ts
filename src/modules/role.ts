/*
 * 角色
*/
import {onMounted, Ref, ref} from "vue"
import {http, HttpResponse} from "@/utils/http"
import {ID, NameValue, PaginationResult, Model} from "@/types/built-in"
import {Permission} from './permission'
import {findConfirmClass, findConfirmName} from '@/enums/confirm'

/**
 * 角色模型
 */
export interface Role extends Model {
    //角色名称
    name: string,
    //角色描述
    description: string,
    //规则名称
    ruleName: string,
    //是否内置
    isBuiltIn: number,
    //是否内置名称
    isBuiltInName?: string | null,
    //是否内置样式Class
    isBuiltInClass?: string | null,
    //角色权限列表
    permissions?: Permission[]
}

/**
 * 将原始数据转换成角色模型
 * @param data 要转换的数据
 */
export function dataToRole(data: any): Role {
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
        isBuiltIn: data.isBuiltIn,
        //是否内置名称
        isBuiltInName: findConfirmName(data.isBuiltIn),
        //是否内置样式Class
        isBuiltInClass: findConfirmClass(data.isBuiltIn)
    }
}

/**
 * 新增角色
 * @param data 数据
 */
export function createRole(data: any): Promise<HttpResponse> {
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
export function updateRole(data: any): Promise<HttpResponse> {
    return http.put(
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
    return http.delete(
        '/role/delete',
        {
            data: {
                id: ids
            }
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
export function fetchRole(id: ID): Promise<Role | null> {
    return http.get(
        '/role/detail?id=' + id
    ).then((response) => {
        if (!response.isOk) {
            return null
        }
        const data = response.data.data
        return dataToRole(data.item)
    })
}

/**
 * 获取角色列表
 * @param params 查询参数
 */
export function fetchRoles(params: Record<string, any> = {}): Promise<Role[]> {
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
            return dataToRole(item)
        })
    })
}

/**
 * 获取分页之后的角色列表
 * @param params 查询参数
 */
export function fetchPageRoles(params: Record<string, any> = {}): Promise<PaginationResult<Role>> {
    return http.get(
        '/role/page-items',
        {
            params
        }
    ).then((response) => {
        const result = response.data
        const data = {
            items: [] as Role[],
            total: 0
        }
        if (response.isOk) {
            data.items = result.data.items.map((item: any) => {
                return dataToRole(item)
            })
            data.total = result.data.total
        }
        return data
    })
}

/**
 * 使用角色列表
 * @param preload 是否预先加载
 */
export function useRoles(preload: boolean = true) {
    const roles: Ref<Role[]> = ref([])
    const loadRoles = (...args: any[]) => {
        return fetchRoles(...args).then((items) => {
            return roles.value = items
        })
    }
    if (preload) {
        onMounted(loadRoles)
    }
    return {
        roles,
        loadRoles
    }
}

/**
 * 角色权限列表
 * @param roleId 角色ID
 */
export function fetchRolePermissions(roleId: ID): Promise<Array<Permission>> {
    return http.get(
        '/role/permissions?id=' + roleId
    ).then((response) => {
        if (!response.isOk) {
            return []
        }
        return response.data.data.items
    })
}
