// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import App from './App'
import router from './utils/router'
import store from './utils/store'
import api from './utils/api'
import _ from 'lodash'
import preset from './utils/data'

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype._ = _
Vue.prototype.preset = preset

Vue.use(ElementUI)
Vue.use(MavonEditor)

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
