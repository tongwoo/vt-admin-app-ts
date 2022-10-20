/**
 * 功能：RBAC
 * 日期：2022-06-14
 */
import {http} from "@/utils/http"

export function fetchRules(): Promise<object[]> {
    return http.get(
        '/permission/rules'
    ).then((response) => {
        return response.data.data.items
    })
}
