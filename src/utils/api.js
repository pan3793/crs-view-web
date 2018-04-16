import axios from './axios'
import qs from 'qs'

export default {
  login (params) {
    return axios.post('/crs-server/api/auth/login', params, {transformRequest: data => qs.stringify(data)})
  },
  logout (token) {
    return axios.post('/crs-server/api/auth/logout', {token}, {transformRequest: data => qs.stringify(data)})
  },
  // user
  fetchUsers () {
    return axios.get('/crs-auth-server/api/user')
  },
  fetchUserById (id) {
    return axios.get(`/crs-auth-server/api/user/${id}`)
  },
  queryUser (query) {
    return axios.post('/crs-auth-server/api/user/query', query)
  },
  saveUser (entity) {
    return axios.post('/crs-auth-server/api/user', entity)
  },
  removeUserById (id) {
    return axios.delete(`/crs-auth-server/api/user/${id}`)
  },
  fetchTeacherIdNameList () {
    return axios.get('/crs-auth-server/api/user/teacherIdNameList')
  },
  resetPasswordById (id, newPassword) {
    return axios.post(`/crs-auth-server/api/user/${id}/resetPassword`, {newPassword}, {transformRequest: data => qs.stringify(data)})
  },
  // role
  fetchRoles () {
    return axios.get('/crs-auth-server/api/role')
  },
  fetchRoleById (id) {
    return axios.get(`/crs-auth-server/api/role/${id}`)
  },
  queryRole (query) {
    return axios.post('/crs-auth-server/api/role/query', query)
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
  queryAcl (query) {
    return axios.post('/crs-auth-server/api/acl/query', query)
  },
  saveAcl (entity) {
    return axios.post('/crs-auth-server/api/acl', entity)
  },
  removeAclById (id) {
    return axios.delete(`/crs-auth-server/api/acl/${id}`)
  },
  // category
  fetchCategories () {
    return axios.get('/crs-server/api/category')
  },
  fetchCategoryIdNameList () {
    return axios.get('/crs-server/api/category/idNameList')
  },
  fetchCategoryById (id) {
    return axios.get(`/crs-server/api/category/${id}`)
  },
  queryCategory (query) {
    return axios.post('/crs-server/api/category/query', query)
  },
  saveCategory (entity) {
    return axios.post('/crs-server/api/category', entity)
  },
  removeCategoryById (id) {
    return axios.delete(`/crs-server/api/category/${id}`)
  },
  // course
  fetchCoursesWithCardName () {
    return axios.get('/crs-server/api/course/allWithCardName')
  },
  queryCourseWithCardName (query) {
    return axios.post('/crs-server/api/course/queryWithCardName', query)
  },
  fetchCourseIdNameList () {
    return axios.get('/crs-server/api/course/idNameList')
  },
  fetchRecommendedCourses () {
    return axios.get('/crs-server/api/course/recommended')
  },
  fetchCourseById (id) {
    return axios.get(`/crs-server/api/course/${id}`)
  },
  fetchCourseDetailById (id) {
    return axios.get(`/crs-server/api/course/${id}/detail`)
  },
  queryCourse (query) {
    return axios.post('/crs-server/api/course/query', query)
  },
  saveCourse (entity) {
    return axios.post('/crs-server/api/course', entity)
  },
  removeCourseById (id) {
    return axios.delete(`/crs-server/api/course/${id}`)
  },
  bindImageById (id, imageUrl) {
    return axios.post(`/crs-server/api/course/${id}/bindImage`, {imageUrl}, {transformRequest: data => qs.stringify(data)})
  },
  removeImageById (id) {
    return axios.post(`/crs-server/api/course/${id}/removeImage`)
  },
  bindCardById (id, cardId) {
    return axios.post(`/crs-server/api/course/${id}/bindCard`, {cardId}, {transformRequest: data => qs.stringify(data)})
  },
  removeCardByCourseId (id, cardId) {
    return axios.post(`/crs-server/api/course/${id}/removeCard`, {cardId}, {transformRequest: data => qs.stringify(data)})
  },
  // card
  fetchCards () {
    return axios.get('/crs-server/api/card/')
  },
  fetchCardById (id) {
    return axios.get(`/crs-server/api/card/${id}`)
  },
  saveCard (entity) {
    return axios.post('/crs-server/api/card', entity)
  },
  removeCardById (id) {
    return axios.delete(`/crs-server/api/card/${id}`)
  },
  // file
  uploadFile (file) {
    let param = new FormData()
    param.append('files', file, file.name)
    return axios.post('/crs-file-server/api/file/upload', param, {headers: {'Content-Type': 'multipart/form-data'}}
    )
  },
  fetchFilesByIds (ids) {
    return axios.post(`/crs-file-server/api/file/queryByIds`, ids)
  },
  // question
  queryQuestion (query) {
    return axios.post('/crs-server/api/question/query', query)
  },
  fetchQuestionById (id) {
    return axios.get(`/crs-server/api/question/${id}`)
  },
  saveQuestion (entity) {
    return axios.post('/crs-server/api/question', entity)
  },
  removeQuestionById (id) {
    return axios.delete(`/crs-server/api/question/${id}`)
  },
  fetchQuestionTypeList () {
    return axios.get('/crs-server/api/question/typeList')
  },
  fetchQuestionCheckTypeList () {
    return axios.get('/crs-server/api/question/checkTypeList')
  },
  editQuestionAskAndAnswer (questionId, ask, answer) {
    return axios.post(`/crs-server/api/question/${questionId}/editAskAndAnswer`, {ask, answer})
  },
  clearQuestionAskAndAnswer (questionId) {
    return axios.post(`/crs-server/api/question/${questionId}/clearAskAndAnswer`)
  },
  // block
  fetchBlocks () {
    return axios.get('/crs-forum-server/api/blocks')
  },
  queryBlock (query) {
    return axios.post('/crs-forum-server/api/block/query', query)
  },
  fetchBlockById (id) {
    return axios.get(`/crs-forum-server/api/block/${id}`)
  },
  saveBlock (entity) {
    return axios.post('/crs-forum-server/api/block', entity)
  },
  removeBlockById (id) {
    return axios.delete(`/crs-forum-server/api/block/${id}`)
  },
  fetchBlockIdNameList () {
    return axios.get('/crs-forum-server/api/block/idNameList')
  },
  // topic
  fetchTopics () {
    return axios.get('/crs-forum-server/api/topic')
  },
  queryTopic (query) {
    return axios.post('/crs-forum-server/api/topic/query', query)
  },
  fetchTopicById (id) {
    return axios.get(`/crs-forum-server/api/topic/${id}`)
  },
  fetchTopicDetailById (id) {
    return axios.get(`/crs-forum-server/api/topic/${id}/detail`)
  },
  saveTopic (entity) {
    return axios.post('/crs-forum-server/api/topic', entity)
  },
  removeTopicById (id) {
    return axios.delete(`/crs-forum-server/api/topic/${id}`)
  },
  bindDiscussionById (id, discussionId) {
    return axios.post(`/crs-forum-server/api/topic/${id}/bindDiscussion`, {discussionId}, {transformRequest: data => qs.stringify(data)})
  },
  // discussion
  fetchDiscussions () {
    return axios.get('/crs-forum-server/api/discussion')
  },
  fetchDiscussionById (id) {
    return axios.get(`/crs-forum-server/api/discussion/${id}`)
  },
  saveDiscussion (entity) {
    return axios.post('/crs-forum-server/api/discussion', entity)
  },
  removeDiscussionById (id) {
    return axios.delete(`/crs-forum-server/api/discussion/${id}`)
  }
}
