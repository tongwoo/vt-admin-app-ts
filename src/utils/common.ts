/**
 * 是否是空值
 * @param data 要检测的数据
 */
export function isEmpty(data: any): boolean {
    return data === '' || data === null || data === undefined
}

/**
 * 是否是数值
 * @param data 要检测的数据
 */
export function isNumeric(data: any): boolean {
    return typeof data === 'number' || !isNaN(parseFloat(data))
}

/**
 * 从数据集合中提取指定字段连续的相同时段数据并生成新的集合
 * @param items 数据集合
 * @param nameField 要提取的名称字段
 * @param valueField 要提取的值字段
 */
export function mergeProps<T extends Record<string, any>>(items: T[], nameField: keyof T, valueField: keyof T): (T & { firstValue: T[typeof valueField], lastValue: T[typeof valueField] })[] {
    const segments: Array<T & { firstValue: T[typeof valueField], lastValue: T[typeof valueField] }> = []
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const key = item[nameField]
        const segment: (typeof segments)[number] = {
            ...item,
            firstValue: item[valueField],
            lastValue: item[valueField]
        }
        segments.push(segment)
        for (let j = i + 1; j < items.length; j++) {
            if (key === items[j][nameField]) {
                segment.lastValue = items[j][valueField]
                i = j
                continue
            }
            break
        }
    }
    return segments
}

/**
 * 查找叶子节点
 * @param items 要查找的数据节点集合
 * @param childKey 子节点子属性名
 */
export function findLeafNode<T extends { [key: string]: any }>(items: T[], childKey: string = 'children'): T | null {
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item[childKey]?.length > 0) {
            return findLeafNode(item[childKey], childKey)
        } else {
            return item
        }
    }
    return null
}
