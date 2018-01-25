<template>
  <div style="min-height: 100%; display: flex; flex-direction: column;">

    <div style="z-index: 1000; width: 100%; height: 60px; padding: 0; background: white;">
      <div style="height: 60px; padding: 0; background: lightslategrey">
        TopBar
      </div>
    </div>

    <div style="display: flex; flex: 1; background: cornflowerblue">
      <el-menu style="width: 200px; text-align: start"
               default-active="2"
               @open="handleOpen"
               @close="handleClose">

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
      <div style="flex: 1; background: blueviolet">
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
