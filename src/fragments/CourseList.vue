<template>
  <div>
    <el-form :inline="true" :model="formData" style="text-align: start">
      <el-form-item label="分类">
        <el-select v-model="formData.EQ_categoryId" placeholder="请选择" :clearable="true">
          <el-option v-for="category in categoryList"
                     :key="category.id"
                     :label="category.name"
                     :value="category.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程名">
        <el-input v-model="formData.LIKE_name"></el-input>
      </el-form-item>
      <el-form-item label="教师">
        <el-input v-model="formData.EQ_teacherName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onClickQuery" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col :span="6" v-for="course in courses" :key="course.id" style="padding: 15px">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <div :style="background(course.imageUrl)" style="width: 278px; height: 208px"></div>
          <div>
            <el-button type="text" @click="goCourse(course.id)">{{course.name}}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="paginationMeta.sizes"
      :current-page="paginationMeta.currentNumber"
      @current-change="onPageNumChange"
      :page-size="paginationMeta.size"
      @size-change="onPageSizeChange"
      :total="paginationMeta.total">
    </el-pagination>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    data () {
      return {
        categoryList: [],
        courses: [],
        formMeta: {},
        formData: {
          EQ_categoryId: parseInt(this.$route.query.EQ_categoryId) || null,
          LIKE_name: this.$route.query.LIKE_name || '',
          EQ_teacherName: this.$route.query.EQ_teacherName || '',
          P_NUM: parseInt(this.$route.query.P_NUM) || 0,
          P_SIZE: parseInt(this.$route.query.P_SIZE) || 10
        },
        paginationMeta: {
          sizes: [5, 10, 20, 50],
          currentNumber: parseInt(this.$route.query.P_NUM) + 1 || 1,
          size: parseInt(this.$route.query.P_SIZE) || 10,
          total: 0
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$store.commit('changeSearchBarVisible', false)
      })
    },
    beforeRouteLeave (to, from, next) {
      this.$store.commit('changeSearchBarVisible', true)
      next()
    },
    mounted () {
      this.refreshCourses()
      this.refreshCategoryIdNameList()
    },
    watch: {
      '$route.query' (val) {
        this.formData.EQ_categoryId = parseInt(val.EQ_categoryId) || null
        this.formData.LIKE_name = val.LIKE_name || ''
        this.formData.EQ_teacherName = val.EQ_teacherName || ''
        this.formData.P_NUM = parseInt(val.P_NUM) || 0
        this.formData.P_SIZE = parseInt(val.P_SIZE) || 10
        this.refreshCourses()
      }
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      truncate (str, len) {
        return this._.truncate(str, {'length': len})
      },
      background (imageUrl) {
        let imgUrl = this.isBlank(imageUrl) ? require('../assets/logo.png') : imageUrl
        return {
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      },
      onClickQuery () {
        this.refreshCourses()
      },
      goCourse (id) {
        this.$router.push(`/course/${id}`)
      },
      onPageNumChange (pageNum) {
        this.formData.P_NUM = pageNum - 1
        this.refreshCourses()
      },
      onPageSizeChange (pageSize) {
        this.formData.P_SIZE = pageSize
        this.refreshCourses()
      },
      refreshCategoryIdNameList () {
        this.$api.fetchCategoryIdNameList().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.categoryList = response.data.data
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      },
      refreshCourses () {
        this.$api.queryCourse(this.formData).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.courses = response.data.data.content
              this.paginationMeta.total = response.data.data.totalElements
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      }
    }
  }
</script>
