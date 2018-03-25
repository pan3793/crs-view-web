import Vue from 'vue'
import Vuex from 'vuex'
import data from './data'
import * as func from './func'
import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 菜单
    menus: data.menus,
    adminMenus: data.adminMenus,
    // 搜索条
    searchBarVisible: true,
    // 登录信息
    token: localStorage.token,
    userInfo: func.parseJSON(localStorage.userInfo),
    loginName: localStorage.loginName,
    password: localStorage.password,
    remember: localStorage.remember === 'true',
    autoLogin: localStorage.autoLogin === 'true'
  },
  mutations: {
    updateTopBarMenuCategories (state, categories) {
      state.menus.find((it) => it.title === '分类').children =
        categories.map(it => ({title: it.name, path: `/courseList?EQ_categoryId=${it.id}`}))
    },
    changeSearchBarVisible (state, flag) {
      if (typeof flag === 'boolean') {
        state.searchBarVisible = flag
      } else {
        state.searchBarVisible = false
      }
    },
    updateToken (state, val) {
      state.token = val
      if (_.isEmpty(val)) {
        localStorage.removeItem('token')
      } else {
        localStorage.token = val
      }
    },
    updateUserInfo (state, val) {
      state.userInfo = val
      if (_.isEmpty(val)) {
        localStorage.removeItem('userInfo')
      } else {
        localStorage.userInfo = JSON.stringify(val)
      }
    },
    updateLoginName (state, val) {
      state.loginName = val
      if (_.isEmpty(val)) {
        localStorage.removeItem('loginName')
      } else {
        localStorage.loginName = val
      }
    },
    updatePassword (state, val) {
      state.password = val
      if (_.isEmpty(val)) {
        localStorage.removeItem('password')
      } else {
        localStorage.password = val
      }
    },
    updateRemember (state, val) {
      state.remember = val
      if (val === null || val === undefined) {
        localStorage.removeItem('remember')
      } else {
        localStorage.remember = val
      }
    },
    updateAutoLogin (state, val) {
      state.autoLogin = val
      if (val === null || val === undefined) {
        localStorage.removeItem('autoLogin')
      } else {
        localStorage.autoLogin = val
      }
    }
  }
})
