// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
Vue.prototype.$http=axios
/* 引入element模块 */
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/* 引入public.css和reset.css */
import './styles/public.css'
import './styles/reset.css'
//引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
//引入jQuery
import $ from 'jquery'
//引入状态管理
import {store} from './store/store'

Vue.config.productionTip = false
Vue.use(Element)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
