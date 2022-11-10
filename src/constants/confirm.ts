import {NameValue} from "@/types/built-in"

//是
export const CONFIRM_YES = 1

//否
export const CONFIRM_NO = 0

/**
 * 确认列表
 */
export function getConfirms(): Array<NameValue<number>> {
    return [
        {
            name: '是',
            value: CONFIRM_YES
        },
        {
            name: '否',
            value: CONFIRM_NO
        }
    ]
}

/**
 * 获取确认名称
 * @param value 要获得名称的值
 */
export function getConfirmName(value: number): string | undefined {
    return getConfirms().find(item => item.value === value)?.name
}

/**
 * 获取确认使用的样式
 * @param value 值
 */
export function getConfirmClass(value: number): string | undefined {
    if (value === CONFIRM_YES) {
        return 'confirm-yes'
    } else if (value === CONFIRM_NO) {
        return 'confirm-no'
    }
}
