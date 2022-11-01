/*
 * 功能：权限
 * 作者：wutong
 * 日期：2022-11-01
*/
import {http, HttpResponse} from '@/utils/http'
import {ID, NameValue, PageResult, Model} from "@/types/built-in"

/**
 * 权限模型
 */
export interface PermissionModel extends Model {
    //父权限
    parentId: number,
    //权限名称
    name: string,
    //权限描述
    description: string,
    //规则名称
    ruleName: string,
}

/**
 * 权限列表项
 */
export interface PermissionItem extends Model {
    ///....
}


/**
 * 将原始数据转换成权限模型
 * @param data 要转换的数据
 */
export function dataToPermissionModel(data: any): PermissionModel {
    return {
        //原始数据
        _raw: data,
        //ID
        id: data.id,
        //父权限
        parentId: data.parentId,
        //权限名称
        name: data.name,
        //权限描述
        description: data.description,
        //规则名称
        ruleName: data.ruleName
    }
}

/**
 * 将权限模型转换成数据项
 * @param model 权限模型
 */
export function modelToPermissionItem(model: PermissionModel): PermissionItem {
    return {
        ...model
    }
}

/**
 * 新增权限
 * @param data 数据
 */
export function createPermission(data: object): Promise<HttpResponse> {
    return http.post(
        '/permission/create',
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
 * 更新权限
 * @param data 数据
 */
export function updatePermission(data: object): Promise<HttpResponse> {
    return http.post(
        '/permission/update',
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
 * 删除权限
 * @param ids 数据ID
 */
export function removePermission(ids: ID | ID[]): Promise<HttpResponse> {
    return http.post(
        '/permission/delete',
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
 * 获取权限详情
 * @param id 主键ID
 */
export function fetchPermission(id: ID): Promise<PermissionModel | null> {
    return http.get(
        '/permission/detail?id=' + id
    ).then((response) => {
        return response.isOk ? dataToPermissionModel(response.data.data.item) : null
    })
}

/**
 * 获取权限列表
 * @param params 查询参数
 */
export function fetchPermissions(params: Record<string, any> = {}): Promise<PermissionModel[]> {
    return http.get(
        '/permission/items',
        {
            params
        }
    ).then((response) => {
        const body = response.data
        if (!response.isOk) {
            return []
        }
        return body.data.items.map((item: any) => {
            return dataToPermissionModel(item)
        })
    })
}

/**
 * 获取分页之后的权限列表
 * @param params 查询参数
 */
export function fetchPagePermissions(params: Record<string, any> = {}): Promise<PageResult<PermissionModel>> {
    return http.get(
        '/permission/page-items',
        {
            params
        }
    ).then((response) => {
        const body = response.data
        const data = {
            items: [] as PermissionModel[],
            total: 0
        }
        if (response.isOk) {
            data.items = body.data.items.map((item: any) => {
                return dataToPermissionModel(item)
            })
            data.total = body.data.total
        }
        return data
    })
}

/**
 * 获取权限键值对列表
 * @param params 查询参数
 */
export function fetchPairPermissions(params: Record<string, any> = {}): Promise<NameValue[]> {
    return fetchPermissions(params).then((items) => {
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
 * 权限树
 */
export interface PermissionTree extends PermissionModel {
    children: PermissionModel[]
}

/**
 * 获取权限数
 * @return {Promise<Array>}
 */
export function fetchPermissionTree(params = {}): Promise<PermissionTree[]> {
    return http.get(
        '/permission/tree',
        {
            params
        }
    ).then((response) => {
        if (!response.isOk) {
            return []
        }
        return response.data.data.items
    })
}
