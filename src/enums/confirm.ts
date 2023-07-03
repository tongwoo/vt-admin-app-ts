import {NameValue} from '@/types/built-in'
import {Ref, ref} from 'vue'

/*
 * 确认
 */
export enum Confirm {
    /**
     * 是
     */
    YES = 1,

    /**
     * 否
     */
    NO = 0
}

/**
 * 获取确认列表
 */
export function useConfirms(): Ref<NameValue<Confirm>[]> {
    return ref([
        {
            name: '是',
            value: Confirm.YES
        },
        {
            name: '否',
            value: Confirm.NO
        }
    ])
}

/**
 * 获取确认名称
 * @param value 要获得名称的值
 */
export function findConfirmName(value: any): string | null {
    return useConfirms().value.find(item => item.value === value)?.name ?? null
}

/**
 * 获取确认使用的样式
 * @param value 值
 */
export function findConfirmClass(value: any): string | null {
    if (value === Confirm.YES) {
        return 'confirm-yes'
    } else if (value === Confirm.NO) {
        return 'confirm-no'
    } else {
        return null
    }
}
