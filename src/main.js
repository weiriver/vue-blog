import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/normalize.css'
import '@/assets/css/common.scss'
import '@/components'
import {api} from '@/http/api'
import {showMsg} from '@/utils/util'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(mavonEditor)
Vue.use(infiniteScroll)
Vue.config.productionTip = false
Vue.prototype.showMsg = showMsg
Vue.prototype.api = api
Vue.prototype.Event = new Vue()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
