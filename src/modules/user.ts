/*
 * 功能：用户
 * 作者：wutong
 * 日期：2022-10-14
*/
import {RoleModel} from "@/modules/role"
import {http, HttpResponse} from '@/utils/http'
import {ID, NameValue, PageResult, Model} from "@/types/built-in"

/**
 * 用户模型
 */
export interface UserModel extends Model {
    //用户名
    username: string,
    //登录密码
    password: string,
    //姓名
    name: string,
    //头像
    avatar: string,
    //状态
    state: number,
    //上次登录时间
    loginTime: string,
    //拥有的角色列表
    roles?: RoleModel[]
}

/**
 * 用户项
 */
export interface UserItem extends Model {
    //角色名称列表
    roleNames:string[],
    //状态名称
    stateName?: string,
    //状态样式
    stateClass?: string,
}

/**
 * 新增用户
 * @param data 数据
 */
export function createUser(data: object): Promise<HttpResponse> {
    return http.post(
        '/user/create',
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
export function updateUser(data: object): Promise<HttpResponse> {
    return http.post(
        '/user/update',
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
export function removeUser(ids: ID | ID[]): Promise<HttpResponse> {
    return http.post(
        '/user/delete',
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
export function fetchUser(id: ID): Promise<HttpResponse> {
    return http.get(
        '/user/detail?id=' + id
    ).then((response) => {
        const body = response.data
        const success = response.isOk
        return {
            success: success,
            message: body.message,
            data: success ? body.data.item : null
        }
    })
}

/**
 * 获取用户列表
 * @param params 参数
 * @return {Promise<Array>}
 */
export function fetchUsers(params: object = {}): Promise<Array<UserModel>> {
    return http.get(
        '/user/items',
        {
            params
        }
    ).then((response) => {
        return response.data.data.items
    })
}

/**
 * 获取分页之后的用户列表
 * @param params 参数
 */
export function fetchPageUsers(params: object = {}): Promise<PageResult> {
    return http.get(
        '/user/page-items',
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
export function fetchPairUsers(params: object = {}): Promise<Array<NameValue>> {
    return fetchUsers(params).then((items) => {
        return items.map((item) => {
            return {
                name: item.name,
                value: item.id,
                origin: item
            }
        })
    })
}

