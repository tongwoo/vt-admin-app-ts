import {createPinia, PiniaPluginContext} from 'pinia'
import {readAuthorization} from '@/utils/authorize'

export const pinia = createPinia()

/**
 * Pinia插件 - 解决无法在setup方式中调用$reset，必须在所有插件中首先调用，否则$reset的是初次从缓存中取的值！
 */
pinia.use(({store}) => {
    const initialState = JSON.parse(JSON.stringify(store.$state))
    store.$reset = () => {
        store.$patch(initialState)
    }
})


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
    //删除不需要缓存的数据
    excludes.forEach((item) => {
        if (context.store.$id === item.storeId && data?.[item.property]) {
            delete data[item.property]
        }
    })
    //在恢复用户数据的时候，从本地存储中取出授权信息，不使用pinia中的数据，有些项目是需要关闭浏览器就要求授权失效
    if (context.store.$id === 'user') {
        data.authorization = readAuthorization()
    }
    context.store.$subscribe((mutation, state) => {
        localStorage.setItem(mutation.storeId, JSON.stringify(state))
    })
    return {
        ...data
    }
})
