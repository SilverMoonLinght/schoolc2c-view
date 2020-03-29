import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import ZkTable from 'vue-table-with-tree-grid'




Vue.use(ZkTable)


import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8081'
axios.defaults.headers.common["token"] = localStorage.getItem('token');
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')