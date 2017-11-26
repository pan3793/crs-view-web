<template>
<div>
  <el-row type="flex" align="middle" justify="space-around">
    <el-col :span="5" style="font-size: 24px">
        <i class="el-icon-edit"/>课程资源系统
    </el-col>
    <el-col :span="9">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" backgroud-color="blueviolet">
        <el-menu-item index="1">微课堂</el-menu-item>
          <el-submenu index="2">
            <template slot="title">课程分类</template>
            <el-menu-item index="2-1">计算机</el-menu-item>
            <el-menu-item index="2-2">经济学</el-menu-item>
            <el-menu-item index="2-3">数理</el-menu-item>
          </el-submenu>
        <el-menu-item index="3">交流论坛</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="5">
      <el-input v-model="input" placeholder="请输入内容">
        <el-button slot="append" type="primary" icon="el-icon-search"></el-button>
      </el-input>
    </el-col>
    <el-col :span="5">
      <el-button type="primary">登录</el-button>
      <el-button type="warning">注册</el-button>
    </el-col>
  </el-row>
</div>
</template>

<script>
  export default {
    data () {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        input: ''
      }
    },
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>

