<template>
  <div>
    <el-row type="flex" align="middle" justify="space-around">
      
      <el-col :span="4" style="font-size: 24px">
          <i class="el-icon-edit"/>课程资源系统
      </el-col>
      
      <el-col :span="11">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" backgroud-color="blueviolet">
          
          <template v-for="item in menu">
  
            <el-submenu 
              v-if="item.children"
              :key="item.index"
              :index="item.url">
              <template slot="title">{{item.title}}</template>
              <el-menu-item 
                v-for="item in item.children"
                :key="item.index"
                :index="item.url">
                {{item.title}}
              </el-menu-item>
            </el-submenu>

            <el-menu-item 
              v-else
              :key="item.index"
              :index="item.url">
              {{item.title}}
            </el-menu-item>

          </template>

        </el-menu>
      </el-col>

      <el-col :span="5">
        <el-input v-model="input" placeholder="请输入内容">
          <el-button slot="append" type="primary" icon="el-icon-search"></el-button>
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
  import { mapState } from 'vuex'
  export default {
    data () {
      return {
        activeIndex: '1',
        input: ''
      }
    },
    computed: mapState([
      'menu'
    ]),
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>

