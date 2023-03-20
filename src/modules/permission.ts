/*
 * 权限
*/
import {onMounted, Ref, ref} from "vue"
import {http, HttpResponse} from "@/utils/http"
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
 * 将原始数据转换成权限模型
 * @param data 要转换的数据
 */
export function dataToPermissionModel(data: any): PermissionModel {
    return {
        //原数据
        _: data,
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
 * 新增权限
 * @param data 数据
 */
export function createPermission(data: any): Promise<HttpResponse> {
    return http.post(
        '/permission/create',
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
 * 更新权限
 * @param data 数据
 */
export function updatePermission(data: any): Promise<HttpResponse> {
    return http.put(
        '/permission/update',
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
 * 删除权限
 * @param ids 数据ID
 */
export function removePermission(ids: ID | ID[]): Promise<HttpResponse> {
    return http.delete(
        '/permission/delete',
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
 * 获取权限详情
 * @param id 主键ID
 */
export function fetchPermission(id: ID): Promise<PermissionModel | null> {
    return http.get(
        '/permission/detail?id=' + id
    ).then((response) => {
        if (!response.isOk) {
            return null
        }
        const data = response.data.data
        return dataToPermissionModel(data.item)
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
        const result = response.data
        if (!response.isOk) {
            return []
        }
        return result.data.items.map((item: any) => {
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
        const result = response.data
        const data = {
            items: [] as PermissionModel[],
            total: 0
        }
        if (response.isOk) {
            data.items = result.data.items.map((item: any) => {
                return dataToPermissionModel(item)
            })
            data.total = result.data.total
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
                value: item.id
            }
        })
    })
}


/**
 * 使用权限列表
 * @param params 查询参数
 * @param callback 加载完成后的回调
 */
export function usePermissions(params: Record<string, any> = {}, callback?: () => void): Ref<PermissionModel[]> {
    const permissions = ref<PermissionModel[]>([])
    onMounted(async () => {
        permissions.value = await fetchPermissions(params)
        if (callback !== undefined) {
            callback()
        }
    })
    return permissions
}

/**
 * 使用权限名称值列表
 * @param params 查询参数
 * @param callback 加载完成后的回调
 */
export function usePairPermissions(params: Record<string, any> = {}, callback?: () => void): Ref<NameValue[]> {
    const permissions = ref<NameValue[]>([])
    onMounted(async () => {
        permissions.value = await fetchPairPermissions(params)
        if (callback !== undefined) {
            callback()
        }
    })
    return permissions
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

/**
 * 使用权限树
 */
export function usePermissionTree() {
    const tree = ref<PermissionTree[]>([])
    onMounted(async () => {
        tree.value = await fetchPermissionTree({
            root: 1
        })
    })
    return tree
}
