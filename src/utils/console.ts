import setting from "@/setting";

/**
 * 构建控制台头部信息
 * @param color 颜色
 */
export function buildConsoleHeadInfo(color: string) {
    const date = new Date()
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    const ms = date.getMilliseconds()
    const msn = ms < 10 ? '00' + ms : ms < 100 ? '0' + ms : ms
    const time = hours + ':' + minutes + ':' + seconds + '.' + msn
    return {
        content: `%c ${setting.name} %c ${time} `,
        style: [`background-color:#444;color:white;padding:2px 0;`, `background-color:${color};color:white;padding:2px 0;`]
    }
}

/**
 * 输出常规日志
 * @param args 参数列表
 */
export function log(...args: any[]): void {
    const {content, style} = buildConsoleHeadInfo('#2d8cf0')
    console.log(content, ...style, ...args)
}

/**
 * 输出告警日志
 * @param args 参数列表
 */
export function warn(...args: any[]): void {
    const {content, style} = buildConsoleHeadInfo('#e5953a')
    console.log(content, ...style, ...args)
}

/**
 * 输出错误日志
 * @param args 参数列表
 */
export function err(...args: any[]): void {
    const {content, style} = buildConsoleHeadInfo('#e5213f')
    console.log(content, ...style, ...args)
}
