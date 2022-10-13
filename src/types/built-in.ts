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
    items: Array<object>
}

/**
 * 查询参数
 */
export interface QueryParam {
    [key: string]: any,

    page: number
}

/**
 * 记录项
 */
export interface RecordItem {
    [key: string]: any,

    //主键ID
    id: ID,
}
