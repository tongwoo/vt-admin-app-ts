/*
 * 用户
*/
import {onMounted, Ref, ref} from "vue"
import {http, HttpResponse} from "@/utils/http"
import {ID, NameValue, PaginationResult, Model} from "@/types/built-in"
import {findUserStateName, findUserStateClass} from "@/enums/user-state"
import {Role} from "@/modules/role"

/**
 * 用户模型
 */
export interface User extends Model {
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
    //状态名称
    stateName?: string | null,
    //状态样式Class
    stateClass?: string | null,
    //上次登录时间
    loginTime: string,
    //用户角色
    roles?: Role[]
}

/**
 * 将原始数据转换成用户模型
 * @param data 要转换的数据
 */
export function dataToUser(data: any): User {
    return {
        //ID
        id: data.id,
        //用户名
        username: data.username,
        //登录密码
        password: data.password,
        //姓名
        name: data.name,
        //头像
        avatar: data.avatar,
        //状态
        state: data.state,
        //状态名称
        stateName: findUserStateName(data.state),
        //状态样式Class
        stateClass: findUserStateClass(data.state),
        //上次登录时间
        loginTime: data.loginTime,
        //角色
        roles: data.roles
    }
}

/**
 * 新增用户
 * @param data 数据
 */
export function createUser(data: any): Promise<HttpResponse> {
    return http.post(
        '/user/create',
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
 * 更新用户
 * @param data 数据
 */
export function updateUser(data: any): Promise<HttpResponse> {
    return http.put(
        '/user/update',
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
 * 删除用户
 * @param ids 数据ID
 */
export function removeUser(ids: ID | ID[]): Promise<HttpResponse> {
    return http.delete(
        '/user/delete',
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
 * 获取用户详情
 * @param id 主键ID
 */
export function fetchUser(id: ID): Promise<User | null> {
    return http.get(
        '/user/detail?id=' + id
    ).then((response) => {
        if (!response.isOk) {
            return null
        }
        const data = response.data.data
        return dataToUser(data.item)
    })
}

/**
 * 获取用户列表
 * @param params 查询参数
 */
export function fetchUsers(params: Record<string, any> = {}): Promise<User[]> {
    return http.get(
        '/user/items',
        {
            params
        }
    ).then((response) => {
        const result = response.data
        if (!response.isOk) {
            return []
        }
        return result.data.items.map((item: any) => {
            return dataToUser(item)
        })
    })
}

/**
 * 获取分页之后的用户列表
 * @param params 查询参数
 */
export function fetchPageUsers(params: Record<string, any> = {}): Promise<PaginationResult<User>> {
    return http.get(
        '/user/page-items',
        {
            params
        }
    ).then((response) => {
        const data = {
            items: [] as User[],
            total: 0
        }
        if (response.isOk) {
            const result = response.data
            data.items = result.data.items.map((item: any) => {
                return dataToUser(item)
            })
            data.total = result.data.total
        }
        return data
    })
}

/**
 * 使用用户列表
 * @param preload 是否预先加载
 */
export function useUsers(preload: boolean = true) {
    const users: Ref<User[]> = ref([])
    const loadUsers = (...args: any[]) => {
        return fetchUsers(...args).then((items) => {
            return users.value = items
        })
    }
    if (preload) {
        onMounted(loadUsers)
    }
    return {
        users,
        loadUsers
    }
}
