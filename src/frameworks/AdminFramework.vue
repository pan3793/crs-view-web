<template>
  <div style="min-height: 100%; display: flex; flex-direction: column;">

    <div style="display: flex; justify-content: space-between; align-items: center;
                height: 60px; padding: 0; background: #263238; padding: 0 20px">
      <div style="font-size: 24px; color: #eceff1">
        <i class="el-icon-setting"/>
        <span>课程资源系统管理平台</span>
      </div>
      <div>
        <el-tooltip v-if="!isBlank(token)" class="item" effect="dark" placement="bottom"
                    :content="'欢迎 ' + userInfo.name + ' 使用！'">
          <el-button type="text" size="medium">{{userInfo.name}}</el-button>
        </el-tooltip>
        <el-button type="success" size="medium" @click="onClickHome">返回主页</el-button>
        <el-button v-if="isBlank(token)" type="primary" size="medium" @click="onClickLogin">登录</el-button>
        <el-button v-else type="warning" size="medium" @click="onClickLogout">注销</el-button>
      </div>
    </div>

    <div style="display: flex; flex: 1;">
      <!--动态构建二级菜单-->
      <el-menu style="width: 200px; text-align: start"
               :router="true"
               background-color="#37474f"
               text-color="#eceff1"
               active-text-color="#40c4ff">

        <template v-for="item in adminMenus">

          <el-submenu
            v-if="item.children"
            :key="item.path"
            :index="item.path">
            <template slot="title">{{item.title}}</template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.path"
              :index="subItem.path">
              {{subItem.title}}
            </el-menu-item>
          </el-submenu>

          <el-menu-item
            v-else
            :key="item.path"
            :index="item.path">
            {{item.title}}
          </el-menu-item>

        </template>
      </el-menu>

      <div style="flex: 1; overflow: auto;">
        <router-view/>
      </div>
    </div>


  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    name: 'AdminFramework',
    data () {
      return {}
    },
    computed: {
      adminMenus () {
        return this.$store.state.adminMenus
      },
      token () {
        return this.$store.state.token
      },
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      onClickLogin () {
        this.$router.push(`/login?redirect=${this.$router.currentRoute.fullPath}`)
      },
      onClickHome () {
        this.$router.push('/home')
      },
      onClickLogout () {
        this.logout()
      },
      logout () {
        this.$api.logout(this.token).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.$store.commit('updateToken', null)
              this.$store.commit('updateUserInfo', null)
              this.$store.commit('updateAutoLogin', null)
              break
            case Constant.FAILURE_CODE:
              this.$message.error(response.data.msg)
          }
        })
      }
    }
  }
</script>

<style>

</style>
