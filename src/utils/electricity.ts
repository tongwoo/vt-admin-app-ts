import moment from 'moment'

/**
 * 用电时段
 */
interface TimeSegment {
    //时段名称 尖峰平谷
    name: string,
    //起始时间，格式：13:30
    start: string | null,
    //结束时间，格式：13:30
    stop: string | null,
}

/**
 * 从数据集合中提取指定字段连续的相同时段数据并生成一个时段集合
 * @param items 数据集合
 * @param nameField 要提取的名称字段
 * @param timeField 要提取的时间字段
 * @param format 是否自动格式化成时间格式
 */
export function buildTimeSegments<T extends Record<string, any>>(items: T[], nameField: string, timeField: string, format: boolean = false): TimeSegment[] {
    const segments: TimeSegment[] = []
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const key = item[nameField]
        const segment: TimeSegment = {
            name: key,
            start: format ? moment(item[timeField]).format('HH:mm') : item[timeField],
            stop: null
        }
        segments.push(segment)
        for (let j = i + 1; j < items.length; j++) {
            if (key === items[j][nameField]) {
                segment.stop = format ? moment(items[j][timeField]).format('HH:mm') : items[j][timeField]
                i = j
                continue
            }
            break
        }
    }
    return segments
}

/**
 * 时段位置
 */
interface TimeSegmentPosition {
    //时段名称
    name: string,
    //起始与结束位置
    range: [number, number]
}

/**
 * 计算时段的配置
 * @param segments 时段集合
 */
export function computeTimeSegmentPosition(segments: TimeSegment[]): TimeSegmentPosition[] {
    //24小时的总分钟数
    const minutes = 1440

    /**
     * 计算时间所占的百分比
     */
    const computePercent = (time: string): number => {
        return timeToMinutes(time) / minutes * 100
    }

    /**
     * 将时间字符串转换成分钟数
     * @param time 时间，示例 08:30
     */
    const timeToMinutes = (time: string) => {
        const [hour, minute] = [...time.split(':')]
        return parseInt(hour) * 60 + parseInt(minute)
    }

    return segments.map((segment) => {
        return {
            name: segment.name,
            range: [
                computePercent(segment.start!),
                computePercent(segment.stop!)
            ]
        }
    })
}
