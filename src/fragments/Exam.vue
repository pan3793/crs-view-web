<template>
  <div style="text-align: left">
    <el-card>
      <div slot="header">
        <h1>{{exam.name}}</h1>
        <el-tag size="small">{{exam.courseName}}</el-tag>
        <el-tag type="success" size="small">{{exam.teacherName}}</el-tag>
      </div>
      <div>{{exam.description}}</div>
    </el-card>
    <div v-for="(question, index) in exam.questions" :key="question.id" style="padding-top: 30px">
      <el-card>
        <div>
          <span><h3 style="display: inline">题目{{index + 1}}</h3></span>
          <span style="float: right"><el-tag size="small" type="danger">难度{{question.score}}</el-tag></span>
        </div>
        <mavon-editor :value="question.ask"
                      defaultOpen="preview"
                      :subfield="false"
                      :editable="false"
                      :toolbarsFlag="false"
                      style="min-height: auto; margin: 5px 0">
        </mavon-editor>
      </el-card>
      <el-collapse>
        <el-card body-style="padding: 0 15px">
          <el-collapse-item name="1" title="查看答案">
            <mavon-editor :value="question.answer"
                          defaultOpen="preview"
                          :subfield="false"
                          :editable="false"
                          :toolbarsFlag="false"
                          style="min-height: auto; margin: 5px">
            </mavon-editor>
          </el-collapse-item>
        </el-card>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    name: 'Exam',
    data () {
      return {
        exam: {}
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.refreshExamDetail()
      })
    },
    watch: {
      '$route.params.id' (val) {
        this.refreshExamDetail()
      }
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      truncate (str, len) {
        return this._.truncate(str, {'length': len})
      },
      refreshExamDetail () {
        this.$api.fetchExamDetailById(this.$route.params.id).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.exam = response.data.data
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
