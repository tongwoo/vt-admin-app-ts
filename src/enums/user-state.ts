import {NameValue} from "@/types/built-in"
import {Ref, ref} from 'vue'

/**
 * 状态
 */
export enum UserState {
    /**
     * 启用
     */
    Enabled = 1,
    /**
     * 禁用
     */
    Disabled = 0,
}

/**
 * 获得状态列表
 */
export function useUserStates(): Ref<NameValue[]> {
    return ref([
        {
            name: '启用',
            value: UserState.Enabled
        },
        {
            name: '禁用',
            value: UserState.Disabled
        }
    ])
}

/**
 * 获取状态名称
 * @param value 值
 */
export function getUserStateName(value: any): string | null {
    return useUserStates().value.find(item => item.value === value)?.name ?? null
}

/**
 * 获取状态样式Class
 * @param value 值
 */
export function getUserStateClass(value: any): string | null {
    if (value === UserState.Enabled) {
        return 'state-enabled'
    } else if (value === UserState.Disabled) {
        return 'state-disabled'
    } else {
        return null
    }
}
