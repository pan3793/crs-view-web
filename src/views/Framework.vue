<template>
  <el-container style="min-height: 600px; height: 100vh">
    
    <el-header height="60px" style="padding: 0"><Header/></el-header>
    
    <div style="height: 1px; background: #e6e6e6"/>
    
    <el-row type="flex" justify="center" style="display: flex; flex: 1;">
      <el-main style="max-width: 1440px;"><Home/></el-main>
    </el-row>
    
    <div style="height: 1px; background: #e6e6e6"/>

    <el-footer style="flex: 0"><Footer/></el-footer>
  
  </el-container>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Home from '@/components/Home'

export default {
  name: 'Framework',
  components: {
    Header,
    Home,
    Footer
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>