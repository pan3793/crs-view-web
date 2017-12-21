import axios from './axios'
export default {
  login (param) {
    return axios.post('/AuthAdmin/v2/web_login', param)
  }
}
