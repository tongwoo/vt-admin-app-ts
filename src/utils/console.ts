/**
 * 构建控制台头部信息
 * @param color 颜色
 */
export function buildConsoleHeadInfo(color: string) {
    const date = new Date()
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const time = date.getHours() + ':' + minutes + ':' + date.getSeconds() + '.' + date.getMilliseconds()
    return {
        content: `%cVT-ADMIN ${time}`,
        style: `background:linear-gradient(90deg,#555 62px,${color} 62px);color:white;padding:0 6px;`
    }
}

/**
 * 输出常规日志
 * @param args 参数列表
 */
export function log(...args: any[]): void {
    const {content, style} = buildConsoleHeadInfo('#2d8cf0')
    for (const arg of args) {
        console.log(content, style, arg)
    }
}

/**
 * 输出告警日志
 * @param args 参数列表
 */
export function warn(...args: any[]): void {
    const {content, style} = buildConsoleHeadInfo('#e5953a')
    for (const arg of args) {
        console.warn(content, style, arg)
    }
}

/**
 * 输出错误日志
 * @param args 参数列表
 */
export function err(...args: any[]): void {
    const {content, style} = buildConsoleHeadInfo('#e5213f')
    for (const arg of args) {
        console.error(content, style, arg)
    }
}
