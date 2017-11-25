<template>
  <el-container style="min-height: 100vh">
    <el-header id="header">Header</el-header>
    <el-container>
      <el-aside id="aside">Aside</el-aside>
      <el-main id="main">Main</el-main>
    </el-container>
    <el-footer id="footer">Footer</el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'Framework',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
#header {
  background: red
}

#aside {
  background: yellow
}

#main {
  background: green
}

#footer {
  background: blue
}
</style>
