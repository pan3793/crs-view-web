import Vue from 'vue'
import Vuex from 'vuex'
import data from './data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menus: data.menus,
    adminMenus: data.adminMenus,
    searchBarVisible: true
  },
  mutations: {
    updateTopBarMenuCategories (state, categories) {
      state.menus.find((it) => it.title === '分类').children =
        categories.map(it => ({title: it.name, path: `/courseList?EQ_id=${it.id}`}))
    },
    changeSearchBarVisible (state, flag) {
      if (typeof flag === 'boolean') {
        state.searchBarVisible = flag
      } else {
        state.searchBarVisible = false
      }
    }
  }
})
