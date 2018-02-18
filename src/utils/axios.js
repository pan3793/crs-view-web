import axios from 'axios'
import router from './router'
import vue from '../main'
import * as Constant from './constant'

axios.interceptors.request.use(
  request => {
    let token = localStorage.getItem('token')
    if (token) {
      request.headers['CRS-TOKEN'] = `${token}`
    }
    return request
  },
  error => {
    return Promise.reject(error)
  })

axios.interceptors.response.use(
  response => {
    if (response) {
      switch (response.status) {
        case Constant.TOKEN_INVALID_CODE:
          localStorage.removeItem('token')
          localStorage.removeItem('password')
          router.push({
            path: 'login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          break
        case Constant.NO_PERMISSION_CODE:
          vue.$message(response.data.message)
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
