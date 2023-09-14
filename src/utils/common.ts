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
 * 从树中查找第一个叶子节点
 * @param nodes 要查找的数据节点集合
 * @param childKey 子节点子属性名
 */
export function findLeafNode<T extends { [key: string]: any }>(nodes: T[], childKey: string = 'children'): T | null {
    if (nodes.length === 0) {
        return null
    }
    const node = nodes[0]
    if (node[childKey]?.length > 0) {
        return findLeafNode(node[childKey], childKey)
    }
    return node
}

/**
 * 从树中查找目标节点
 * @param nodes 要查找的数据节点集合
 * @param property 节点值所对应的属性名称
 * @param target 要查找的目标节点值
 * @param childKey 子节点子属性名
 */
export function findTargetNode<T extends { [key: string]: any }>(nodes: T[], property: string, target: any, childKey: string = 'children'): T | null {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node[property] == target) {
            return node
        }
        if (node[childKey]?.length > 0) {
            const tn = findTargetNode(node[childKey] as T[], property, target, childKey)
            if (tn !== null) {
                return tn
            }
        }
    }
    return null
}
