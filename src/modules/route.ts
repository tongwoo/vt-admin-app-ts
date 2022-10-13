/**
 * 功能：路由
 * 日期：2022-06-16
 */
import {ID, NameValue, PageResult} from "@/types/built-in"
import {http, HttpResponse} from '@/utils/http'

/**
 * 新增用户
 * @param data 数据
 */
function createRoute(data: object): Promise<HttpResponse> {
    return http.post(
        '/route/create',
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
function updateRoute(data: object): Promise<HttpResponse> {
    return http.post(
        '/route/update',
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
function removeRoute(ids: ID | ID[]): Promise<HttpResponse> {
    return http.post(
        '/route/delete',
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
function fetchRoute(id: ID): Promise<HttpResponse> {
    return http.get(
        '/route/detail?id=' + id
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
function fetchRoutes(params: object = {}): Promise<Record<string, any>[]> {
    return http.get(
        '/route/items',
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
function fetchPageRoutes(params: object = {}): Promise<PageResult> {
    return http.get(
        '/route/page-items',
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
function fetchPairRoutes(params: object = {}): Promise<Array<NameValue<string>>> {
    return fetchRoutes(params).then((items) => {
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
 * 清空路由
 */
function truncateRoutes(): Promise<boolean> {
    return http.get(
        '/route/truncate'
    ).then((response) => {
        return response.isOk
    })
}

/**
 * 生成路由
 */
function generateRoutes(): Promise<boolean> {
    return http.get(
        '/route/generate'
    ).then((response) => {
        return response.isOk
    })
}

export {
    createRoute,
    updateRoute,
    removeRoute,
    fetchRoute,
    fetchRoutes,
    fetchPageRoutes,
    fetchPairRoutes,
    truncateRoutes,
    generateRoutes
}
