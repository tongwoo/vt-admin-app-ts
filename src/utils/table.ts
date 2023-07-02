import {TableColumnCtx} from 'element-plus'

interface SpanTableProps<T> {
    row: T
    column: TableColumnCtx<T>
    rowIndex: number
    columnIndex: number
}

/**
 * 使用表格合并
 * @param fieldName 要提取合并的字段名
 */
export function useSpanTable<T>(fieldName: keyof T) {
    //合并单元格的Map，span为要合并多少行，handled代表是否已经处理过
    const map = new Map<string, { span: number, handled: boolean }>()

    /**
     * 过滤提取，需要保证数据里的同名字段是连续的
     * @param items 要提取的集合，即：对数据列表进行过滤处理并记录连续同名的字段有多少行，用于合并处理
     */
    const filter = (items: T[]) => {
        map.clear()
        //从集合中提取过滤后的唯一名称放进map用于合并单元格
        items.forEach((item) => {
            const key: string = item[fieldName] as any
            if (map.has(key)) {
                map.set(key, {
                    span: map.get(key)!.span + 1,
                    handled: false,
                })
            } else {
                map.set(key, {
                    span: 1,
                    handled: false,
                })
            }
        })
    }

    /**
     * 用于给 el-table#span-method 调用的合并方法
     */
    const span = (prop: SpanTableProps<T>) => {
        //表格组件有bug，会整体的调用2次合并，所以此处判断如果又出现
        //了第一行第一列，那么之前的处理不算数重新进行处理
        if (prop.rowIndex === 0 && prop.columnIndex === 0) {
            map.forEach((item) => {
                item.handled = false
            })
        }
        //只处理第一列
        if (prop.columnIndex !== 0) {
            return
        }
        const key: string = prop.row[fieldName] as any
        if (!map.has(key)) {
            return
        }
        const item = map.get(key)!
        if (item.handled) {
            return [
                0,
                0
            ]
        } else {
            item.handled = true
            return [
                item.span,
                1
            ]
        }
    }

    return {
        filter,
        span
    }
}
