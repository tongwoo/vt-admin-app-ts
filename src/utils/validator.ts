/**
 * 是否是空值
 * @param data 要检测的数据
 */
export function isEmpty(data: any): boolean {
    return data === '' || data === null || data === undefined
}

/**
 * 是否是数值
 * @param data 要检测的数据
 */
export function isNumeric(data: any): boolean {
    return typeof data === 'number' || !isNaN(parseFloat(data))
}

