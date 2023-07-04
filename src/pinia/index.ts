import {createPinia, PiniaPluginContext} from 'pinia'

export const pinia = createPinia()

//需要排除不恢复的state
const excludes = [
    {
        storeId: 'app',
        property: 'components',
    }
]

/**
 * Pinia插件 - 持久化保存store到localStorage以及自动恢复
 */
pinia.use((context: PiniaPluginContext) => {
    const backup = localStorage.getItem(context.store.$id)
    const data = backup ? JSON.parse(backup) : {}
    excludes.forEach((item) => {
        if (context.store.$id === item.storeId && data?.[item.property]) {
            delete data[item.property]
        }
    })
    context.store.$subscribe((mutation, state) => {
        localStorage.setItem(mutation.storeId, JSON.stringify(state))
    })
    return {
        ...data
    }
})

/**
 * Pinia插件 - 解决无法在setup方式中调用$reset
 */
pinia.use(({ store }) => {
    const initialState = JSON.parse(JSON.stringify(store.$state));
    store.$reset = () => {
        store.$patch(initialState);
    }
})
