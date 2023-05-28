/**
 * 是否是空值
 * @param data 要检测的数据
 */
export function isEmpty(data: any): boolean {
    return data === '' || data === null || data === undefined
}
