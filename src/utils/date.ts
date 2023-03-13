import moment from "moment"
import "moment/locale/zh-cn"

/**
 * 一分钟的秒数
 * @type {number}
 */
export const ONE_MINUTE_SECONDS = 60

/**
 * 一小时的秒数
 * @type {number}
 */
export const ONE_HOUR_SECONDS = 3600

/**
 * 一天的秒数
 * @type {number}
 */
export const ONE_DAY_SECONDS = 86400

/**
 * 一个星期的秒数
 * @type {number}
 */
export const ONE_WEEK_SECONDS = 604800

/**
 * 一个月的秒数
 * @type {number}
 */
export const ONE_MONTH_SECONDS = 2592000

/**
 * 当前格式化好的日期时间
 * @return {string}
 */
export function currentDateText() {
    return moment().format('YYYY年MM月DD日 HH:mm:ss dddd')
}

/**
 * 当前格式化好的日期时间
 * @return {string}
 */
export function currentTimeText() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 获得给定日期所在月的天数
 * @param date 日期,可为Date实例、日期字符串,不传则使用当前时间
 */
export function getDays(date: Date | string = new Date()): number {
    if (date === undefined) {
        date = new Date()
    } else {
        if (!(date instanceof Date)) {
            date = new Date(date)
        }
    }
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    let days = 0
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            days = 31
            break
        case 2:
            days = 28
            //判断是否闰年
            if (year % 4 === 0) {
                days = 29
            }
            break
        case 4:
        case 6:
        case 9:
        case 11:
            days = 30
            break
    }
    return days
}

/**
 * 获得指定日期的天集合
 * @param date 日期,可为Date实例、日期字符串,不传则使用当前时间
 * @param zero 是否补充前缀0
 */
export function getDayItems(date: Date | string = new Date(), zero: boolean = true): string[] {
    const days = getDays(date)
    const items = []
    for (let i = 1; i <= days; i++) {
        let day = String(i)
        if (zero) {
            day = i < 10 ? '0' + day : day
        }
        items.push(day)
    }
    return items
}

/**
 * 根据间隔秒数来生成0点-24点的分钟段
 * @param interval 间隔秒数,默认为1小时
 */
export function getMinuteSegments(interval: number = 3600, zero: boolean = true) {
    const daySeconds = 86400
    const items = []
    let currentSeconds = 0
    while (currentSeconds < daySeconds) {
        const hours = Math.floor(currentSeconds / 3600)
        const minutes = Math.floor((currentSeconds - hours * 3600) / 60)
        let hour = String(hours)
        let minute = String(minutes)
        if (zero && hours < 10) {
            hour = '0' + hours
        }
        if (zero && minutes < 10) {
            minute = '0' + minutes
        }
        items.push(hour + ':' + minute)
        currentSeconds += interval
    }
    return items
}

/**
 * 获取月数集合
 * @param {boolean} zero 是否填充0
 * @param {string} suffix 后缀，比如 “月”
 */
export function getMonthItems(zero = true, suffix = '') {
    const items = []
    for (let i = 1; i <= 12; i++) {
        let item = String(i)
        if (zero && i < 10) {
            item = '0' + item
        }
        if (suffix) {
            item = `${item}${suffix}`
        }
        items.push(item)
    }
    return items
}

/**
 * 生成以前指定的年份到现在的年份集合
 * @param begin 起始年份
 * @param end 结束年份，默认为当前年
 * @param pair 是否键值对
 */
export function yearRangeItems(begin: number, end: number | undefined, pair = true) {
    const current = end === undefined ? (new Date()).getFullYear() : end
    const items = []
    for (let year = begin; year <= current; year++) {
        if (pair) {
            items.push({
                label: year.toString(),
                value: year
            })
        } else {
            items.push(year)
        }
    }
    return items
}
