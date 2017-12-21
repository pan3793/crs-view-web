import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    systemId: localStorage.userSystemId,
    userSystemId: localStorage.userSystemId
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
