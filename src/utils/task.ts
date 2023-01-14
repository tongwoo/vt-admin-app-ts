/**
 * 防抖
 * @param executor 要执行的函数引用
 * @param delay 多长时后间才执行，单位：毫秒
 */
export function debounce(executor: () => void, delay = 1000): () => void {
    let taskId: number | null = null
    return function () {
        if (taskId) {
            window.clearTimeout(taskId)
        }
        taskId = window.setTimeout(executor, delay)
    }
}

/**
 * 节流
 * @param executor 要执行的函数引用
 * @param delay 间隔多长时后间才能继续执行，单位：毫秒
 */
export function throttle(executor: () => void, delay = 500): () => void {
    let beginTime: number = new Date().getTime()
    return function () {
        const currentTime: number = new Date().getTime()
        if (currentTime - beginTime >= delay) {
            executor()
            beginTime = currentTime
        }
    }
}

/**
 * 轮询
 * @param executor 要执行的返回值为Promise的函数
 * @param interval 执行时间间隔，单位：毫秒
 * @param now 是否立即执行
 */
export function loop(executor: () => Promise<void>, interval = 1000, now = true) {
    let id: number | null

    async function run() {
        await executor()
        if (id !== null) {
            id = window.setTimeout(run, interval)
        }
    }

    if (now) {
        run()
    } else {
        id = window.setTimeout(run, interval)
    }

    return function () {
        window.clearTimeout(id!)
        id = null
    }
}

/**
 * 睡眠
 * @param millisecond 毫秒数
 */
export function sleep(millisecond: number = 1000) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, millisecond)
    })
}
