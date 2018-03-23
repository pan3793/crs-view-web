import axios from 'axios'
import router from './router'
import store from './store'
import vue from '../main'
import * as Constant from './constant'

axios.interceptors.request.use(
  request => {
    let token = store.state.token
    if (token) {
      request.headers['CRS-TOKEN'] = token
    }
    return request
  },
  error => {
    return Promise.reject(error)
  })

axios.interceptors.response.use(
  response => {
    if (response) {
      switch (response.data.code) {
        case Constant.TOKEN_INVALID_CODE:
          let redirect = router.currentRoute.path === '/login' ? '/home' : router.currentRoute.fullPath
          router.push({path: '/login', query: {redirect}})
          break
        case Constant.NO_PERMISSION_CODE:
          vue.$message.error(response.data.msg)
          break
      }
    }
    return response
  },
  error => {
    vue.$message.error('请求超时')
    return Promise.reject(error)
  })

export default axios
