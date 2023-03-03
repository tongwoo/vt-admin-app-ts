import i18n from '@/languages/index'
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './pinia'
import {store, storeKey} from './store'
import elementPlus from 'element-plus'
import 'moment/locale/zh-cn.js'

import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/element.scss'
import './assets/styles/element-patch.scss'
import './assets/styles/app.scss'

const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.use(store, storeKey)
app.use(router)
app.use(elementPlus)
app.mount('#app')
