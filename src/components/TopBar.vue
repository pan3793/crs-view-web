<template>
  <div>
    <el-row type="flex" align="middle" justify="space-around">

      <el-col :span="4" style="font-size: 24px">
        <i class="el-icon-edit"/><span>课程资源系统</span>
      </el-col>

      <el-col :span="11">
        <!--动态构建二级菜单-->
        <el-menu
          :router="true"
          :default-active="menuActive"
          mode="horizontal"
          @select="handleSelect"
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

      <el-col :span="5" :style="{visibility: searchBarVisibility ? 'visible': 'hidden'}">
        <el-input v-model="input" placeholder="请输入内容">
          <el-button slot="append" type="primary" icon="el-icon-search" @click="goCourseList"/>
        </el-input>
      </el-col>

      <el-col :span="4">
        <el-button type="primary" size="medium">登录</el-button>
        <el-button type="warning" size="medium">注册</el-button>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        menuActive: this.$route.path,
        menus: this.$store.state.menus,
        searchBarVisibility: this.$store.state.searchBarVisibility,
        input: ''
      }
    },
    methods: {
      handleSelect (key, keyPath) {
      },
      goCourseList () {
        this.$router.push('/courseList')
      }
    }
  }
</script>

