<template>
  <div>
    <el-row type="flex" align="middle" justify="space-around">

      <el-col :span="4" style="font-size: 24px">
        <i class="el-icon-edit"/><span>课程资源系统</span>
      </el-col>

      <el-col :span="9">
        <!--动态构建二级菜单-->
        <el-menu
          :router="true"
          :default-active="menuActive"
          mode="horizontal"
          backgroud-color="blueviolet">

          <template v-for="item in menus">

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
      </el-col>

      <el-col :span="5" :style="{visibility: searchBarVisible ? 'visible': 'hidden'}">
        <el-input v-model="searchInput" placeholder="请输入内容">
          <el-button slot="append" type="primary" icon="el-icon-search" @click="goCourseList(searchInput)"/>
        </el-input>
      </el-col>

      <el-col :span="6">
        <el-tooltip v-if="!isBlank(token)" class="item" effect="dark" placement="bottom"
                    :content="'欢迎 ' + userInfo.name + ' 使用'">
          <el-button type="text" size="medium">{{userInfo.name}}</el-button>
        </el-tooltip>
        <el-button v-if="!isBlank(token)" type="danger" size="medium" @click="onClickAdmin">后台管理</el-button>
        <el-button v-if="isBlank(token)" type="primary" size="medium" @click="onClickLogin">登录</el-button>
        <el-button v-else type="warning" size="medium" @click="onClickLogout">注销</el-button>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    data () {
      return {
        menuActive: this.$route.path,
        searchInput: ''
      }
    },
    computed: {
      menus () {
        return this.$store.state.menus
      },
      searchBarVisible () {
        return this.$store.state.searchBarVisible
      },
      token () {
        return this.$store.state.token
      },
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    mounted () {
      this.refreshCategories()
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      onClickLogin () {
        this.$router.push(`/login?redirect=${this.$router.currentRoute.fullPath}`)
      },
      onClickAdmin () {
        this.$router.push('/admin')
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
      },
      goCourseList (courseName) {
        this.$router.push(`/courseList?LIKE_name=${courseName}`)
        this.searchInput = ''
      },
      refreshCategories () {
        this.$api.fetchCategoryIdNameList().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.$store.commit('updateTopBarMenuCategories', response.data.data)
              break
            case Constant.FAILURE_CODE:
              this.$message.error('分类加载失败！')
          }
        })
      }
    }
  }
</script>

