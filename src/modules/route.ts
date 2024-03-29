import {onMounted, Ref, ref} from "vue"
import {http, HttpResponse} from '@/utils/http'
import {ID, NameValue, PaginationResult, Model} from "@/types/built-in"

/**
 * 路由模型
 */
export interface Route extends Model {
    //名称
    name: string,
    //路径
    path: string,
    //权限ID
    permissionId: number,
    //权限名称
    permissionName?: string,
    //权限描述
    permissionDescription?: string,
}

/**
 * 路由列表项
 */
export interface RouteItem extends Model {
}


/**
 * 将原始数据转换成路由模型
 * @param data 要转换的数据
 */
export function dataToRoute(data: any): Route {
    return {
        //原始数据
        _: data,
        //ID
        id: data.id,
        //权限
        permissionId: data.permissionId,
        //名称
        name: data.name,
        //路径
        path: data.path,
        //权限名称
        permissionName: data.permissionName,
        //权限描述
        permissionDescription: data.permissionDescription
    }
}

/**
 * 将路由模型转换成数据项
 * @param model 路由模型
 */
export function modelToRouteItem(model: Route): RouteItem {
    return {
        ...model
    }
}

/**
 * 新增路由
 * @param data 数据
 */
export function createRoute(data: object): Promise<HttpResponse> {
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
 * 更新路由
 * @param data 数据
 */
export function updateRoute(data: object): Promise<HttpResponse> {
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
 * 删除路由
 * @param ids 数据ID
 */
export function removeRoute(ids: ID | ID[]): Promise<HttpResponse> {
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
 * 获取路由详情
 * @param id 主键ID
 */
export function fetchRoute(id: ID): Promise<Route | null> {
    return http.get(
        '/route/detail?id=' + id
    ).then((response) => {
        return response.isOk ? dataToRoute(response.data.data.item) : null
    })
}

/**
 * 获取路由列表
 * @param params 查询参数
 */
export function fetchRoutes(params: Record<string, any> = {}): Promise<Route[]> {
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
        return body.data.items.map((item: any) => {
            return dataToRoute(item)
        })
    })
}

/**
 * 获取分页之后的路由列表
 * @param params 查询参数
 */
export function fetchPageRoutes(params: Record<string, any> = {}): Promise<PaginationResult<Route>> {
    return http.get(
        '/route/page-items',
        {
            params
        }
    ).then((response) => {
        const body = response.data
        const data = {
            items: [] as Route[],
            total: 0
        }
        if (response.isOk) {
            data.items = body.data.items.map((item: any) => {
                return dataToRoute(item)
            })
            data.total = body.data.total
        }
        return data
    })
}

/**
 * 使用路由列表
 * @param preload 是否预先加载
 */
export function useRoutes(preload: boolean = true) {
    const routes: Ref<Route[]> = ref([])
    const loadRoutes = (...args: any[]) => {
        return fetchRoutes(...args).then((items) => {
            return routes.value = items
        })
    }
    if (preload) {
        onMounted(loadRoutes)
    }
    return {
        routes,
        loadRoutes
    }
}

/**
 * 清空路由
 */
export function truncateRoutes(): Promise<boolean> {
    return http.get(
        '/route/truncate'
    ).then((response) => {
        return response.isOk
    })
}

/**
 * 生成路由
 */
export function generateRoutes(): Promise<boolean> {
    return http.get(
        '/route/generate'
    ).then((response) => {
        return response.isOk
    })
}
