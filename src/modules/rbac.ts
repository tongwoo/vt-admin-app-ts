/**
 * 功能：RBAC
 * 日期：2022-06-14
 */
import {NameValue} from "@/types/built-in"
import {http} from "@/utils/http"
import {onMounted, Ref, ref} from "vue"

/**
 * 获取规则列表
 */
export function fetchRules(): Promise<NameValue[]> {
    return http.get(
        '/permission/rules'
    ).then((response) => {
        return response.data.data.items
    })
}

/**
 * 使用规则列表
 */
export function useRules(): Ref<NameValue[]> {
    const rules = ref<NameValue[]>([])
    onMounted(async () => {
        rules.value = await fetchRules()
    })
    return rules
}
