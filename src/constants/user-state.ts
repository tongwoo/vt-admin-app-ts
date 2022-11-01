/**
 * 功能：状态
 * 日期：2022-06-14
 */

import {NameValue} from "@/types/built-in"

/**
 * 启用
 */
const USER_STATE_ENABLED = 1
/**
 * 禁用
 */
const USER_STATE_DISABLED = 0

/**
 * 状态数据项列表
 */
function getUserStates(): Array<NameValue<number>> {
    return [
        {
            name: '启用',
            value: USER_STATE_ENABLED
        },
        {
            name: '禁用',
            value: USER_STATE_DISABLED
        }
    ]
}

/**
 * 获取状态名称
 * @param value 值
 */
function getUserStateName(value: number): string | undefined {
    return getUserStates().find(item => item.value === value)?.name
}

/**
 * 获取状态使用的样式Class
 * @param value 值
 */
function getUserStateClass(value: number): string | undefined {
    if (value === USER_STATE_ENABLED) {
        return 'state-enabled'
    } else if (value === USER_STATE_DISABLED) {
        return 'state-disabled'
    }
}

export {
    USER_STATE_ENABLED,
    USER_STATE_DISABLED,
    getUserStates,
    getUserStateName,
    getUserStateClass
}
