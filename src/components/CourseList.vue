<template>
  <div>
    <el-form :inline="true" :model="formInline" style="text-align: start">
      <el-form-item label="分类">
        <el-select v-model="formInline.region" placeholder="请选择" :clearable="true">
          <el-option v-for="category in categories" :label="category.name" :value="category.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程名">
        <el-input v-model="formInline.user"></el-input>
      </el-form-item>
      <el-form-item label="教师">
        <el-input v-model="formInline.user"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>


    <el-row>
      <el-col :span="6" v-for="i in 20" style="padding: 15px">
        <el-card :body-style="{ padding: '0px' }">
          <img src="http://101.132.159.21/res/1.jpg" style="width: 100%">
          <div>
            <el-button type="text" @click="goCourse()">精品课程</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :page-size="20"
      :total="56">
    </el-pagination>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        categories: this.preset.categories,
        formInline: {
          user: '',
          region: ''
        }
      }
    },
    methods: {
      onSubmit () {
        console.log('submit!')
      },
      goCourse () {
        this.$router.push('/course/1')
      }
    }
  }
</script>
