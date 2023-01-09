import {NameValue} from "@/types/built-in"

//状态 - 启用
export const USER_STATE_ENABLED = 1

//状态 - 禁用
export const USER_STATE_DISABLED = 0

/**
 * 状态列表
 * @param ignore 需要忽略的项
 */
export function getUserStates(...ignore: number[]): NameValue[] {
    return [
        {
            name: '启用',
            value: USER_STATE_ENABLED
        },
        {
            name: '禁用',
            value: USER_STATE_DISABLED
        }
    ].filter((item) => {
        return ignore.indexOf(item.value) === -1
    })
}

/**
 * 获取状态名称
 * @param value 值
 */
export function getUserStateName(value: number): string | null {
    return getUserStates().find(item => item.value === value)?.name ?? null
}

/**
 * 获取状态样式Class
 * @param value 值
 */
export function getUserStateClass(value: number): string | null {
    if (value === USER_STATE_ENABLED) {
        return 'state-enabled'
    } else if (value === USER_STATE_DISABLED) {
        return 'state-disabled'
    } else {
        return null
    }
}
