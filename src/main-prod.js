import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import NProgress from 'nprogress'
import moment from 'moment'
import axios from 'axios'

/** 拦截器 **/
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios
Vue.prototype.$moment = moment
Vue.config.productionTip = false

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.filter('month', function (originVal) {
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  return `${y}-${m}`
})
Vue.filter('money', function (money) {
  return money.toFixed(2)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
