import {createPinia, PiniaPluginContext} from 'pinia'

export const pinia = createPinia()

/**
 * Pinia插件 - 持久化保存store到localStorage以及自动恢复
 */
pinia.use((context: PiniaPluginContext) => {
    const backup = localStorage.getItem(context.store.$id)
    const data = backup ? JSON.parse(backup) : {}
    context.store.$subscribe((mutation, state) => {
        localStorage.setItem(mutation.storeId, JSON.stringify(state))
    })
    return {
        ...data
    }
})
