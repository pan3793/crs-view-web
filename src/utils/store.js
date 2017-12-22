import Vue from 'vue'
import Vuex from 'vuex'
import data from './data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menu: data.menu
  },
  mutations: {
    setSystemId (state, val) {
      state.systemId = val
    },
    setUserSystemId (state, val) {
      state.userSystemId = val
    }
  }
})
