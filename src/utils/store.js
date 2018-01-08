import Vue from 'vue'
import Vuex from 'vuex'
import data from './data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuList: data.menuList
  },
  mutations: {
    setMenuList (state, val) {
      state.menuList = val
    }
  }
})
