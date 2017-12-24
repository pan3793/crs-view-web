import axios from 'axios'
import qs from 'qs'
import router from './router'

// axios.defaults.baseURL = 'http://192.168.21.30:3000'
// axios.defaults.baseURL = 'http://api.juxiangfen.com'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.transformRequest = [function (data) {
  return qs.stringify(data)
}]

axios.interceptors.request.use(
  config => {
    let token = localStorage.getItem('token')
    if (token) {
      config.headers['X-AUTH-TOKEN'] = `${token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

axios.interceptors.response.use(
  response => {
    if (response.data.code === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('password')
      router.replace({
        path: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.data.code) {
        case 401:
          localStorage.removeItem('token')
          localStorage.removeItem('password')
          router.push({
            path: 'login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
      }
    }
    return Promise.reject(error.response.data)
  })

export default axios
