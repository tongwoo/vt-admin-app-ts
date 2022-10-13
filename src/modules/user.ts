/**
 * 功能：用户
 * 日期：2022-06-14
 */
import {ID, NameValue, PageResult, RecordItem} from "@/types/built-in"
import {http, HttpResponse} from '@/utils/http'


export interface UserItem extends RecordItem {
    name: string,
}

/**
 * 新增用户
 * @param data 数据
 */
function createUser(data: object): Promise<HttpResponse> {
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
function updateUser(data: object): Promise<HttpResponse> {
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
function removeUser(ids: ID | ID[]): Promise<HttpResponse> {
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
function fetchUser(id: ID): Promise<HttpResponse> {
    return http.get(
        '/user/detail?id=' + id
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
function fetchUsers(params: object = {}): Promise<Record<string, any>[]> {
    return http.get(
        '/user/items',
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
function fetchPageUsers(params: object = {}): Promise<PageResult> {
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
function fetchPairUsers(params: object = {}): Promise<Array<NameValue<string>>> {
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

export {
    createUser,
    updateUser,
    removeUser,
    fetchUser,
    fetchUsers,
    fetchPageUsers,
    fetchPairUsers
}
