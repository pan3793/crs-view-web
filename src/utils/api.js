import axios from './axios'
import qs from 'qs'

export default {
  login (param) {
    return axios.post('/crs-auth/api/login', param, {transformRequest: data => qs.stringify(data)})
  },
  fetchCategories () {
    return axios.get('/crs-server/api/category')
  },
  fetchCategoryById (id) {
    return axios.get(`/crs-server/api/category/${id}`)
  },
  saveCategory (param) {
    return axios.post('/crs-server/api/category', param)
  },
  removeCategoryById (id) {
    return axios.delete(`/crs-server/api/category/${id}`)
  }
}
