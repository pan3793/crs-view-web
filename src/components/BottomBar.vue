<template>
  <div style="height: 100%">
    <el-row type="flex" align="middle" justify="space-around" style="height: 100%">
      <el-col :span="24">
        <div>Powered By {{author}}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Footer',
    data () {
      return {
        author: 'PanCheng'
      }
    }
  }
</script>
