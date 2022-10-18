/**
 * 响应数据
 */
export type ResponseData = {
    code: number | string | undefined,
    message: string,
    data: any
}

/**
 * 响应码
 */
export class ResponseCode {
    public static readonly OK = 200
    public static readonly UNAUTHORIZED = 401
    public static readonly FORBIDDEN = 401
    public static readonly NOT_FOUND = 404
    public static readonly ERROR = 500

    public static isOk(code: number): boolean {
        return code === ResponseCode.OK
    }
}

/**
 * 名称&值
 */
export interface NameValue<T = any> {
    [key: string]: any,

    name: string,
    value: T,
}

/**
 * 主键ID
 */
export type ID = string | number

/**
 * 分页结果
 */
export interface PageResult {
    total: number,
    items: any[]
}

/**
 * 查询参数
 */
export interface QueryParam {
    [key: string]: any,

    page: number
}

/**
 * 基础模型
 */
export interface Model {
    [key: string]: any,

    //主键ID
    id: ID,
}

/**
 * 记录集
 */
export interface RecordSet<T> {
    //总数
    total: number,
    //是否加载中
    loading: boolean,
    //每页记录数
    size: number,
    //记录集列表
    items: T[],
    //已选中的记录项列表
    selected: T[],
}
