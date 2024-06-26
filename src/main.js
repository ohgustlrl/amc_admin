import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { store } from "./store/index"
import axios from 'axios'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.$axios = axios

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')