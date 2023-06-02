import moment from "moment"

/**
 * 转换成指定精度的小数
 * @param precision 精度
 */
Number.prototype.asDecimal = function (precision: number = 2): number {
    const nums = this.toString().split('.')
    if (nums.length !== 2) {
        return Number(this)
    }
    nums[1] = nums[1].substring(0, precision)
    return Number(nums.join('.'))
}

/**
 * 转换成日期时间字符串
 * @param format 格式
 */
String.prototype.asDateTime = function (format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    const m = moment(this.toString())
    if (!m.isValid()) {
        return this.toString()
    }
    return m.format(format)
}

/**
 * 转换成日期字符串
 * @param format 格式
 */
String.prototype.asDate = function (format: string = 'YYYY-MM-DD'): string {
    const m = moment(this.toString())
    if (!m.isValid()) {
        return this.toString()
    }
    return m.format(format)
}

/**
 * 转换成时间字符串
 * @param format 格式
 */
String.prototype.asTime = function (format: string = 'HH:mm:ss'): string {
    const m = moment(this.toString())
    if (!m.isValid()) {
        return this.toString()
    }
    return m.format(format)
}

/**
 * 转换换成数值
 */
String.prototype.toNumeric = function (): number {
    return parseFloat(this.toString());
}
