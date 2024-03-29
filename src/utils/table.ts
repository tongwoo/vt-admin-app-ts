import {TableColumnCtx} from 'element-plus'

interface SpanTableProps<T> {
    row: T
    column: TableColumnCtx<T>
    rowIndex: number
    columnIndex: number
}

/**
 * 使用表格合并，先用 filter 过滤数据并赋予表格 data 属性，然后表格 span-method 属性设置 span 方法
 * @param fieldName 要提取合并的字段名
 */
export function useSpanTable<T>(fieldName: keyof T) {
    //合并单元格的Map，span为要合并多少行，handled代表是否已经处理过
    const map = new Map<string, { span: number, handled: boolean }>()

    /**
     * 过滤提取，表格数据需要用此方法调用1次
     * @param items 要提取的集合
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
     * 合并方法（element-ui的表格的属性需要传递此方法），需要保证数据里的同名字段是连续的
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
