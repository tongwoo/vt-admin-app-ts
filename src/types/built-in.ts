/**
 * 响应码
 */
export class ResponseCode {
    //正常
    public static readonly OK = 200
    //未授权
    public static readonly UNAUTHORIZED = 401
    //无权限
    public static readonly FORBIDDEN = 403
    //没有找到路由
    public static readonly NOT_FOUND = 404
    //服务器内部错误
    public static readonly ERROR = 500

    /**
     * 响应是否成功
     * @param code 状态码
     */
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
export interface PageResult<T = any> {
    total: number,
    items: T[]
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
    //原始数据，调用转换模型的方法会增加此参数
    _?: any
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

/**
 * 弹框选项
 */
export interface DialogOption {
    data: any,
    dialog: {
        show: boolean,
        title: string | null
    }
}

/**
 * 菜单项
 */
export interface MenuItem {
    name: string,
    path: string,
    icon?: string,
    show: boolean,
    permission?: string,
    children?: Array<MenuItem>
}
