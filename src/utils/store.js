import Vue from 'vue'
import Vuex from 'vuex'
import data from './data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menus: data.menus,
    adminMenus: data.adminMenus,
    searchBarVisibility: true
  },
  mutations: {}
})
