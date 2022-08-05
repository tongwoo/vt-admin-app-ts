/**
 * 响应数据
 */
export type ResponseData = {
    success: boolean,
    code: number | string | undefined,
    message: string,
    data: any
}

/**
 * 响应码
 */
export class ResponseCode {
    public static readonly OK = 200;
    public static readonly UNAUTHORIZED = 401;
    public static readonly FORBIDDEN = 401;
    public static readonly NOT_FOUND = 404;
    public static readonly ERROR = 500;

    public static isOk(code: number): boolean {
        return code === ResponseCode.OK;
    }
}
