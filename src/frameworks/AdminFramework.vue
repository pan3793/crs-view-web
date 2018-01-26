<template>
  <div style="min-height: 100%; display: flex; flex-direction: column;">

    <div style="display: flex; align-items: center; height: 60px; padding: 0; background: #263238">
      <div style="font-size: 24px; padding-left: 20px; color: #eceff1">
        <i class="el-icon-setting"/>
        <span>课程资源系统管理平台</span>
      </div>
    </div>

    <div style="display: flex; flex: 1;">
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



      <div style="flex: 1;">
        <router-view/>
      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: 'AdminFramework',
    data () {
      return {
        adminMenus: this.$store.state.adminMenus
      }
    }
  }
</script>

<style>

</style>
