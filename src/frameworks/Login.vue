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
            <el-input v-model="formData.userName" placeholder="请输入用户名" required></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formData.password" type="password" placeholder="请输入密码" required></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="formMeta">
              <el-checkbox-button >记住密码</el-checkbox-button>
              <el-checkbox-button >自动登录</el-checkbox-button>
            </el-checkbox-group>
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
  export default {
    name: 'login',
    data () {
      return {
        formMeta: {
          remember: false,
          autoLogin: false
        },
        formData: {
          userName: '',
          password: ''
        },
        background: {
          backgroundImage: 'url(' + require('../assets/image/background/login.jpg') + ')',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }
      }
    },
    methods: {
      onSubmit () {
        console.log('onSubmit')
      }
    }
  }
</script>

<style scoped>

</style>
