import {PATTERN_NUMERIC, PATTERN_SPECIAL_SYMBOL, PATTERN_WORD_LOWER, PATTERN_WORD_UPPER} from '@/constants/pattern'

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

/**
 * 是否包含大小写英文字符、数字、特殊字符
 * @param data 要检测的数据
 */
export function isComplex(data: string): boolean {
    return PATTERN_WORD_LOWER.test(data) && PATTERN_WORD_UPPER.test(data) && PATTERN_NUMERIC.test(data) && PATTERN_SPECIAL_SYMBOL.test(data)
}
