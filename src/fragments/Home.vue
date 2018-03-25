<template>
  <div>
    <el-carousel :interval="4000" type="card" height="360px">
      <el-carousel-item v-for="course in allRecommendedCourses" :key="course.id">
        <img v-if="!isBlank(course.imageUrl)" :src="course.imageUrl" style="min-width: 100%; height: 100%"
             @click="goCourse(course.id)">
        <img v-else src="../assets/logo.png" style="min-width: 100%; height: 100%"
             @click="goCourse(course.id)">
      </el-carousel-item>
    </el-carousel>

    <el-row>
      <el-col :span="12" style="padding: 10px"
              v-for="categoryWithCourse in categoryRecommendCourses" :key="categoryWithCourse.id"
              v-if="!isEmpty(categoryWithCourse.courses)">

        <el-card>
          <div slot="header" style="text-align: start">
            {{categoryWithCourse.name}}
          </div>

          <el-row>
            <el-col :span="12" v-for="course in categoryWithCourse.courses" :key="course.id" style="padding: 15px">
              <el-card :body-style="{ padding: '0px' }">
                <div style="width: 247px; height: 208px">
                  <img v-if="!isBlank(course.imageUrl)" :src="course.imageUrl" style="min-width: 100%; height: 100%">
                  <img v-else src="../assets/logo.png" style="min-width: 100%; height: 100%">
                </div>
                <div>
                  <el-button type="text" @click="goCourse(course.id)">{{course.name}}</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

    </el-row>


  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    data () {
      return {
        allRecommendedCourses: [],
        categoryRecommendCourses: []
      }
    },
    mounted () {
      this.refreshRecommendedCourses()
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      isEmpty (list) {
        return (list == null || list === undefined || list.length === 0)
      },
      goCourse (id) {
        this.$router.push(`/course/${id}`)
      },
      refreshRecommendedCourses () {
        this.$api.fetchRecommendedCourses().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.allRecommendedCourses = response.data.data.all
              this.categoryRecommendCourses = response.data.data.categories
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      }
    }
  }
</script>

<style>
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
