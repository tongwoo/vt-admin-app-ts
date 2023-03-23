import {NameValue} from "@/types/built-in"

/*
 * 确认
 */
export enum Confirm {
    /**
     * 是
     */
    Yes = 1,

    /**
     * 否
     */
    No = 0
}

/**
 * 获取确认列表
 */
export function getConfirms(): NameValue<Confirm>[] {
    return [
        {
            name: '是',
            value: Confirm.Yes
        },
        {
            name: '否',
            value: Confirm.No
        }
    ]
}

/**
 * 获取确认名称
 * @param value 要获得名称的值
 */
export function getConfirmName(value: any): string | null {
    return getConfirms().find(item => item.value === value)?.name ?? null
}

/**
 * 获取确认使用的样式
 * @param value 值
 */
export function getConfirmClass(value: any): string | null {
    if (value === Confirm.Yes) {
        return 'confirm-yes'
    } else if (value === Confirm.No) {
        return 'confirm-no'
    } else {
        return null
    }
}
