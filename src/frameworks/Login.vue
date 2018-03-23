<template>
  <div :style="background" style="height: 100%;">
    <div style="display: flex; justify-content: center; flex-direction: column; align-items: center; height: 100%;
                background: rgba(0, 0, 0, 0.4)">
      <h1 style="padding-bottom: 60px; font-size: 48px; letter-spacing: 12px; color: azure">
        课程资源系统
      </h1>
      <div style="width: 300px; height: 300px">
        <el-form ref="form" :model="formData">
          <el-form-item>
            <el-input v-model="formData.loginName" placeholder="请输入用户名" required></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formData.password" type="password" placeholder="请输入密码" required></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formMeta.remember" style="color: azure; padding-right: 15px">记住密码</el-checkbox>
            <el-checkbox v-model="formMeta.autoLogin" style="color: azure; padding-left: 15px">自动登录</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="onSubmit" style="width: 100%">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    name: 'login',
    data () {
      return {
        formMeta: {
          remember: this.$store.state.remember,
          autoLogin: this.$store.state.autoLogin
        },
        formData: {
          loginName: this.$store.state.loginName,
          password: this.$store.state.password
        },
        // 动态设置背景
        background: {
          backgroundImage: 'url(' + require('../assets/image/background/login.jpg') + ')',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }
      }
    },
    mounted () {
      if (this.formMeta.autoLogin) {
        this.login()
      }
    },
    methods: {
      onSubmit () {
        this.login()
      },
      login () {
        this.$api.login(this.formData).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.$message.success('登录成功！')
              this.$store.commit('updateToken', response.data.data.token)
              this.$store.commit('updateUserInfo', response.data.data)
              this.$store.commit('updateLoginName', this.formData.loginName)
              this.$store.commit('updatePassword', this.formData.password)
              this.$store.commit('updateRemember', this.formMeta.remember)
              this.$store.commit('updateAutoLogin', this.formMeta.autoLogin)
              this.goNext()
              break
            case Constant.FAILURE_CODE:
              this.$store.commit('updateToken', null)
              this.$store.commit('updateUserInfo', null)
              this.$store.commit('updatePassword', null)
              this.$store.commit('updateRemember', null)
              this.$store.commit('updateAutoLogin', null)
              this.$message.error(response.data.msg)
          }
        })
      },
      goNext () {
        this.$router.push(decodeURIComponent(this.$route.query.redirect || '/home'))
      }
    }
  }
</script>

<style scoped>

</style>
