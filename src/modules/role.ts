/**
 * 功能：角色
 * 日期：2022-03-17
 */
import {ID, NameValue, PageResult} from "@/types/built-in"
import {http, HttpResponse} from '@/utils/http'

/**
 * 新增用户
 * @param data 数据
 */
function createRole(data: object): Promise<HttpResponse> {
    return http.post(
        '/role/create',
        data
    ).then((response) => {
        const body = response.data
        return {
            success: response.isOk,
            message: body.message
        }
    })
}

/**
 * 更新用户
 * @param data 数据
 */
function updateRole(data: object): Promise<HttpResponse> {
    return http.post(
        '/role/update',
        data
    ).then((response) => {
        const body = response.data
        return {
            success: response.isOk,
            message: body.message
        }
    })
}

/**
 * 删除用户
 * @param ids 数据ID
 */
function removeRole(ids: ID | ID[]): Promise<HttpResponse> {
    return http.post(
        '/role/delete',
        {
            ids
        }
    ).then((response) => {
        const body = response.data
        return {
            success: response.isOk,
            message: body.message
        }
    })
}

/**
 * 获取用户详情
 * @param id 主键ID
 */
function fetchRole(id: ID): Promise<HttpResponse> {
    return http.get(
        '/role/detail?id=' + id
    ).then((response) => {
        const body = response.data
        return {
            success: response.isOk,
            message: body.message,
            data: body.data?.item
        }
    })
}

/**
 * 获取用户列表
 * @param params 参数
 */
function fetchRoles(params: object = {}): Promise<Record<string, any>[]> {
    return http.get(
        '/role/items',
        {
            params
        }
    ).then((response) => {
        const body = response.data
        if (!response.isOk) {
            return []
        }
        return body.data.items
    })
}

/**
 * 获取分页之后的用户列表
 * @param params 参数
 */
function fetchPageRoles(params: object = {}): Promise<PageResult> {
    return http.get(
        '/role/page-items',
        {
            params
        }
    ).then((response) => {
        const body = response.data
        const data = {
            items: [],
            total: 0
        }
        if (response.isOk) {
            data.items = body.data.items
            data.total = body.data.total
        }
        return data
    })
}

/**
 * 获取用户键值对列表
 * @param params 参数
 */
function fetchPairRoles(params: object = {}): Promise<Array<NameValue<string>>> {
    return fetchRoles(params).then((items) => {
        return items.map((item) => {
            return {
                name: item.name,
                value: item.id,
                origin: item
            }
        })
    })
}


/**
 * 角色权限列表
 * @param roleId 角色ID
 */
function fetchRolePermissions(roleId: ID): Promise<Record<string, any>> {
    return http.get(
        '/role/permissions?id=' + roleId
    ).then((response) => {
        if (!response.isOk) {
            return []
        }
        return response.data.data.items
    })
}

export {
    createRole,
    updateRole,
    removeRole,
    fetchRole,
    fetchRoles,
    fetchPageRoles,
    fetchPairRoles,
    fetchRolePermissions
}
