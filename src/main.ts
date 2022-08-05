import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {store, key} from './store'
import elementPlus from 'element-plus'

import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(store, key)
app.use(router)
app.use(elementPlus)
app.mount('#app')
