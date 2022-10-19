/*
 * 功能：角色
 * 作者：wutong
 * 日期：2022-10-19
*/
import {PermissionModel} from "@/modules/permission"
import {http,HttpResponse} from '@/utils/http';
import {ID, NameValue, PageResult, Model} from "@/types/built-in"

/**
 * 角色模型
 */
export interface RoleModel extends Model{
    //角色名称
    name: string,
    //角色描述
    description: string,
    //规则名称
    ruleName: string,
    //是否内置
    isBuiltIn: number,
    //角色权限
    permissions?: PermissionModel[]
}

/**
 * 角色列表项
 */
export interface RoleItem extends Model{
    //是否内置名称
    isBuiltInName?: string,
    //是否内置样式
    isBuiltInClass?: string,
}

/**
 * 新增角色
 * @param data 数据
 */
export function createRole(data: object): Promise<HttpResponse>{
    return http.post(
        '/role/create',
        data
    ).then((response) => {
        const body = response.data;
        return {
            success: response.isOk,
            message: body.message
        };
    });
}

/**
 * 更新角色
 * @param data 数据
 */
export function updateRole(data: object): Promise<HttpResponse>{
    return http.post(
        '/role/update',
        data
    ).then((response) => {
        const body = response.data;
        return {
            success: response.isOk,
            message: body.message
        };
    });
}

/**
 * 删除角色
 * @param ids 数据ID
 */
export function removeRole(ids: ID|ID[]): Promise<HttpResponse>{
    return http.post(
        '/role/delete',
        {
            ids
        }
    ).then((response) => {
        const body = response.data;
        return {
            success: response.isOk,
            message: body.message
        };
    });
}

/**
 * 获取角色详情
 * @param id 主键ID
 */
export function fetchRole(id: ID): Promise<HttpResponse>{
    return http.get(
        '/role/detail?id='+id,
    ).then((response) => {
        const body = response.data;
        const success = response.isOk;
        return {
            success: success,
            message: body.message,
            data: success ? body.data.item  : null
        };
    });
}

/**
 * 获取角色列表
 * @param params 参数
 * @return {Promise<Array>}
 */
export function fetchRoles(params:object = {}): Promise<Array<RoleModel>>{
    return http.get(
        '/role/items',
        {
            params
        }
    ).then((response) => {
        return response.data.data.items;
    });
}

/**
 * 获取分页之后的角色列表
 * @param params 参数
 */
export function fetchPageRoles(params:object = {}): Promise<PageResult>{
    return http.get(
        '/role/page-items',
        {
            params
        }
    ).then((response) => {
        const body = response.data;
        const data = {
            items: [],
            total: 0
        };
        if (response.isOk) {
            data.items = body.data.items;
            data.total = body.data.total;
        }
        return data;
    });
}

/**
 * 获取角色键值对列表
 * @param params 参数
 */
export function fetchPairRoles(params:object = {}): Promise<Array<NameValue>>{
    return fetchRoles(params).then((items)=>{
        return items.map((item) => {
            return {
                name: item.name,
                value: item.id,
                origin: item
            };
        });
    });
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
