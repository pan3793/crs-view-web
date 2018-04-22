<template>
  <div style="padding: 30px; text-align: start">
    <div>
      <el-form :inline="true" :model="queryFormData" style="text-align: start">
        <el-form-item label="课程">
          <el-input v-model="queryFormData.LIKE_courseName"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="queryFormData.LIKE_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onClickQuery" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>


    <div>
      <el-button type="primary" @click="onClickAdd">添加</el-button>
    </div>

    <!--动态构建table-->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button v-if="tableMeta.operation.change"
                     type="text" size="mini"
                     @click="onClickChangeRow(scope.row)">修改
          </el-button>
          <el-button v-if="tableMeta.operation.remove"
                     type="text" size="mini"
                     @click="onClickRemoveRow(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-for="item in tableMeta.columns_start"
                       :key="item.prop"
                       :prop="item.prop"
                       :label="item.label"
                       :width="item.width"
                       :min-width="item.minWidth"></el-table-column>

      <el-table-column label="题目" width="150" prop="questionIds">
        <template slot-scope="scope">
          <el-button type="primary" size="small"
                     @click="onClickPreviewQuestions(scope.row)">
            预览
          </el-button>
          <el-button type="success" size="small"
                     @click="onClickEditQuestions(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>

      <el-table-column v-for="item in tableMeta.columns_end"
                       :key="item.prop"
                       :prop="item.prop"
                       :label="item.label"
                       :width="item.width"
                       :min-width="item.minWidth"></el-table-column>
    </el-table>

    <div style="margin: 15px">
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

    <el-dialog title="在线测试" :visible.sync="formMeta.visible">
      <el-form :model="formData" :rules="formMeta.rules" ref="form" @submit.native.prevent>
        <el-form-item prop="id" label="Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
          <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
          <el-input v-model.trim="formData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="courseId" label="课程Id" :label-width="formMeta.labelWidth" required>
          <el-input v-model.trim="formData.courseId" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="courseName" label="课程名称" :label-width="formMeta.labelWidth" required>
          <el-select v-model.trim="formData.courseName" style="width: 100%" filterable
                     @change="onCourseNameSelectChange">
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="teacherId" label="教师Id" :label-width="formMeta.labelWidth" required>
          <el-input v-model.trim="formData.teacherId" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="teacherName" label="教师姓名" :label-width="formMeta.labelWidth" required>
          <el-select v-model.trim="formData.teacherName" style="width: 100%" filterable
                     @change="onTeacherNameSelectChange">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="description" label="描述" :label-width="formMeta.labelWidth">
          <el-input type="textarea" v-model.trim="formData.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formMeta.visible = false">取消</el-button>
        <el-button type="primary" @click="onClickSubmit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="预览题目" :visible.sync="previewQuestionsDialogMeta.visible">
      <el-collapse>
        <el-collapse-item
          v-for="question in previewQuestionsDialogMeta.questions"
          :key="question.id"
          :title="truncate(question.ask, 30)"
          :name="question.id">
          <span>问题</span>
          <mavon-editor :value="question.ask"
                        defaultOpen="preview"
                        :subfield="false"
                        :editable="false"
                        :toolbarsFlag="false"
                        style="min-height: auto; margin: 5px">
          </mavon-editor>
          <span>答案</span>
          <mavon-editor :value="question.answer"
                        defaultOpen="preview"
                        :subfield="false"
                        :editable="false"
                        :toolbarsFlag="false"
                        style="min-height: auto; margin: 5px">
          </mavon-editor>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>

    <el-dialog title="编辑题目" :visible.sync="editQuestionsFormMeta.visible">
      <template>
        <div style="text-align: center">
          <el-transfer v-model="editQuestionsFormData.questionIds"
                       :data="editQuestionsFormMeta.allQuestions"
                       :titles="['可选题目', '已选题目']"
                       style="text-align: left; display: inline-block"
                       :props="{key: 'id', label: 'ask'}">
            <span slot-scope="{ option }">
              <el-tooltip placement="right" effect="light">
                <div slot="content">
                  <mavon-editor :value="option.ask"
                                defaultOpen="preview"
                                :subfield="false"
                                :editable="false"
                                :toolbarsFlag="false"
                                style="min-height: auto">
                  </mavon-editor>
                </div>
                <span>{{ truncate(option.ask, 10) }}</span>
              </el-tooltip>
            </span>
          </el-transfer>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editQuestionsFormMeta.visible = false">取消</el-button>
          <el-button type="primary" @click="onClickSubmitQuestions">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    name: 'ExamAdmin',
    data () {
      return {
        typeList: [],
        courseList: [],
        teacherList: [],
        tableMeta: {
          operation: {change: true, remove: true},
          columns_start: [
            {prop: 'id', label: 'Id', width: 60},
            {prop: 'name', label: '名称', width: 300},
            {prop: 'courseName', label: '课程', width: 200}
          ],
          columns_end: [
            {prop: 'teacherName', label: '教师', width: 100},
            {prop: 'creator', label: '创建人', width: 100},
            {prop: 'createTime', label: '创建时间', width: 160},
            {prop: 'modifier', label: '修改人', width: 100},
            {prop: 'modifiedTime', label: '修改时间', width: 160}
          ]
        },
        tableData: [],
        queryFormMeta: {},
        queryFormData: {
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
        },
        formMeta: {
          visible: false,
          showId: false,
          teacherNameDisabled: false,
          labelWidth: '80px',
          rules: {
            name: [
              {required: true, message: '名称不能为空', trigger: 'blur'}
            ]
          }
        },
        formData: {
          id: null,
          description: '',
          courseId: null,
          courseName: '',
          teacherId: null,
          teacherName: ''
        },
        previewQuestionsDialogMeta: {
          visible: false,
          questions: []
        },
        editQuestionsFormMeta: {
          visible: false,
          allQuestions: [],
          rules: {}
        },
        editQuestionsFormData: {
          examId: null,
          questionIds: []
        }
      }
    },
    mounted () {
      this.refreshTable()
      this.refreshTypeCodeNameList()
      this.refreshCourseIdNameList()
      this.refreshTeacherIdNameList()
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      truncate (str, len) {
        return this._.truncate(str, {'length': len})
      },
      onClickQuery () {
        this.refreshTable()
      },
      onClickAdd () {
        this.formData.id = null
        this.formData.name = ''
        this.description = ''
        this.formData.courseId = null
        this.formData.courseName = ''
        this.formData.teacherId = null
        this.formData.teacherName = ''

        this.formMeta.showId = false
        this.formMeta.visible = true
        // 避免首次加载对象不存在
        setTimeout(() => {
          if (this.$refs['form']) {
            this.$refs['form'].clearValidate()
          }
        }, 0)
      },
      onClickChangeRow (row) {
        this.formData.id = row.id
        this.formData.name = row.name
        this.description = row.description
        this.formData.courseId = row.courseId
        this.formData.courseName = row.courseName
        this.formData.teacherId = row.teacherId
        this.formData.teacherName = row.teacherName

        this.formMeta.showId = true
        this.formMeta.visible = true
      },
      onClickRemoveRow (row) {
        this.$confirm('您确定要删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.removeExamById(row.id).then(response => {
            switch (response.data.code) {
              case Constant.SUCCESS_CODE:
                this.$message.success('删除成功！')
                break
              case Constant.FAILURE_CODE:
                this.$message.error('操作失败！')
            }
            this.refreshTable()
          })
        }).catch(() => {
          // do nothing
        })
      },
      onCourseNameSelectChange (courseName) {
        this.formData.courseId = this.courseList.find((it) => it.name === courseName).id
      },
      onTeacherNameSelectChange (teacherName) {
        this.formData.teacherId = this.teacherList.find((it) => it.name === teacherName).id
      },
      onClickSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$api.saveExam(this.formData).then(response => {
              switch (response.data.code) {
                case Constant.SUCCESS_CODE:
                  this.$message.success('修改成功！')
                  this.formMeta.visible = false
                  this.refreshTable()
                  break
                case Constant.FAILURE_CODE:
                  this.$message.error('修改失败！')
              }
            })
          } else {
            return false
          }
        })
      },
      onPageNumChange (pageNum) {
        this.queryFormData.P_NUM = pageNum - 1
        this.refreshTable()
      },
      onPageSizeChange (pageSize) {
        this.queryFormData.P_SIZE = pageSize
        this.refreshTable()
      },
      onClickPreviewQuestions (row) {
        this.previewQuestionsDialogMeta.questions = []
        this.previewQuestionsDialogMeta.visible = true

        this.$api.fetchExamDetailById(row.id).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.previewQuestionsDialogMeta.questions = response.data.data.questions
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      },
      onClickEditQuestions (row) {
        this.editQuestionsFormData.examId = row.id
        this.editQuestionsFormData.questionIds = row.questionIds

        this.$api.fetchQuestionsByCourseId(row.courseId).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.editQuestionsFormMeta.allQuestions = response.data.data
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })

        this.editQuestionsFormMeta.visible = true
      },
      onClickSubmitQuestions () {
        this.$api.editExamQuestionIds(this.editQuestionsFormData.examId, this.editQuestionsFormData.questionIds).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.$message.success('保存成功！')
              this.editQuestionsFormMeta.visible = false
              this.refreshTable()
              break
            case Constant.FAILURE_CODE:
              this.$message.error('保存失败！')
          }
        })
      },
      refreshTable () {
        this.$api.queryExam(this.queryFormData).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.tableData = response.data.data.content
              this.paginationMeta.total = response.data.data.totalElements
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      },
      refreshTypeCodeNameList () {
        this.$api.fetchQuestionTypeList().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.typeList = response.data.data
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      },
      refreshCourseIdNameList () {
        this.$api.fetchCourseIdNameList().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.courseList = response.data.data
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      },
      refreshTeacherIdNameList () {
        this.$api.fetchTeacherIdNameList().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.teacherList = response.data.data
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
