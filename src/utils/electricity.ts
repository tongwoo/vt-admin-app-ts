import moment from 'moment'

/**
 * 用电时段
 */
interface ElectricitySegment {
    //时段名称
    name: string,
    //起始时间，格式：13:30
    start: string | null,
    //结束时间，格式：13:30
    stop: string | null,
}

/**
 * 从数据集合中提取指定字段连续的相同时段数据并组成一个用电时段集合
 * @param items 数据集合
 * @param nameField 要提取的名称字段
 * @param timeField 要提取的时间字段
 */
export function parseElectricitySegments<T extends Record<string, any>>(items: T[], nameField: string, timeField: string) {
    const segments: ElectricitySegment[] = []
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const key = item[nameField]
        const segment:ElectricitySegment = {
            name: key,
            start: moment(item[timeField]).format('HH:mm'),
            stop: null
        }
        segments.push(segment)
        for (let j = i + 1; j < items.length; j++) {
            if (key === items[j][nameField]) {
                segment.stop = moment(items[j][timeField]).format('HH:mm')
                i = j
                continue
            }
            break
        }
    }
    return segments
}
