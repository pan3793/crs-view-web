import Vue from 'vue'
import Router from 'vue-router'
import Framework from '@/views/Framework'
// import Header from '@/components/Header'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Framework',
      component: Framework
      // children: {
      //   path: 'header',
      //   component: Header
      // }
    }
  ]
})
