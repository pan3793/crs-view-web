<template>
  <div>
    <el-form :inline="true" :model="formData" style="text-align: start">
      <el-form-item label="课程">
        <el-input v-model="formData.LIKE_courseName"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="formData.LIKE_name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onClickQuery" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="exams" style="text-align: left">
      <el-table-column prop="courseName" label="课程" width="300"></el-table-column>
      <el-table-column prop="name" label="名称" min-width="300"></el-table-column>
      <el-table-column prop="id" label="" width="120">
        <template slot-scope="scope">
          <el-button type="success" @click="goExam(scope.row.id)">开始测试</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="paginationMeta.sizes"
      :current-page="paginationMeta.currentNumber"
      @current-change="onPageNumChange"
      :page-size="paginationMeta.size"
      @size-change="onPageSizeChange"
      :total="paginationMeta.total"
      style="margin-top: 5px">
    </el-pagination>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    data () {
      return {
        exams: [],
        formMeta: {},
        formData: {
          LIKE_courseName: '',
          LIKE_name: '',
          P_NUM: 0,
          P_SIZE: 10
        },
        paginationMeta: {
          sizes: [5, 10, 20, 50],
          currentNumber: 1,
          size: 10,
          total: 0
        }
      }
    },
    mounted () {
      this.refreshExams()
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      truncate (str, len) {
        return this._.truncate(str, {'length': len})
      },
      onClickQuery () {
        this.refreshExams()
      },
      goExam (id) {
        this.$router.push(`/exam/${id}`)
      },
      onPageNumChange (pageNum) {
        this.formData.P_NUM = pageNum - 1
        this.refreshCourses()
      },
      onPageSizeChange (pageSize) {
        this.formData.P_SIZE = pageSize
        this.refreshCourses()
      },
      refreshExams () {
        this.$api.queryExam(this.formData).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.exams = response.data.data.content
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
