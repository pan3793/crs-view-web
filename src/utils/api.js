import axios from './axios'
import qs from 'qs'

export default {
  login (params) {
    return axios.post('/crs-auth/api/login', params, {transformRequest: data => qs.stringify(data)})
  },
  // user
  fetchUsers () {
    return axios.get('/crs-auth-server/api/user')
  },
  fetchUserById (id) {
    return axios.get(`/crs-auth-server/api/user/${id}`)
  },
  saveUser (entity) {
    return axios.post('/crs-auth-server/api/user', entity)
  },
  removeUserById (id) {
    return axios.delete(`/crs-auth-server/api/user/${id}`)
  },
  // role
  fetchRoles () {
    return axios.get('/crs-auth-server/api/role')
  },
  fetchRoleById (id) {
    return axios.get(`/crs-auth-server/api/role/${id}`)
  },
  saveRole (entity) {
    return axios.post('/crs-auth-server/api/role', entity)
  },
  removeRoleById (id) {
    return axios.delete(`/crs-auth-server/api/role/${id}`)
  },
  fetchRoleIdNameList () {
    return axios.get('/crs-auth-server/api/role/idNameList')
  },
  // acl
  fetchAcls () {
    return axios.get('/crs-auth-server/api/acl')
  },
  fetchAclById (id) {
    return axios.get(`/crs-auth-server/api/acl/${id}`)
  },
  saveAcl (entity) {
    return axios.post('/crs-auth-server/api/acl', entity)
  },
  removeAclById (id) {
    return axios.delete(`/crs-auth-server/api/acl/${id}`)
  },
  // teacher
  fetchTeachers () {
    return axios.get('/crs-server/api/teacher')
  },
  fetchTeacherById (id) {
    return axios.get(`/crs-server/api/teacher/${id}`)
  },
  saveTeacher (entity) {
    return axios.post('/crs-server/api/teacher', entity)
  },
  removeTeacherById (id) {
    return axios.delete(`/crs-server/api/teacher/${id}`)
  },
  fetchUserIdNameList () {
    return axios.get('/crs-server/api/teacher/userIdNameList')
  },
  // category
  fetchCategories () {
    return axios.get('/crs-server/api/category')
  },
  fetchCategoryById (id) {
    return axios.get(`/crs-server/api/category/${id}`)
  },
  saveCategory (entity) {
    return axios.post('/crs-server/api/category', entity)
  },
  removeCategoryById (id) {
    return axios.delete(`/crs-server/api/category/${id}`)
  },
  // course
  fetchCourses () {
    return axios.get('/crs-server/api/course')
  },
  fetchCourseById (id) {
    return axios.get(`/crs-server/api/course/${id}`)
  },
  saveCourse (entity) {
    return axios.post('/crs-server/api/course', entity)
  },
  removeCourseById (id) {
    return axios.delete(`/crs-server/api/course/${id}`)
  }
}
