<template>
  <div style="padding: 30px; text-align: start">
    <div>
      <el-form :inline="true" :model="queryFormData" style="text-align: start">
        <el-form-item label="课程">
          <el-input v-model="queryFormData.LIKE_courseName"></el-input>
        </el-form-item>
        <el-form-item label="教师">
          <el-input v-model="queryFormData.LIKE_teacherName"></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="queryFormData.EQ_type" placeholder="请选择" :clearable="true" style="width: 100px">
            <el-option v-for="type in typeList"
                       :key="type.code"
                       :label="type.name"
                       :value="type.name"/>
          </el-select>
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

      <el-table-column label="题目/答案" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small"
                     @click="onClickAddAskAndAnswer(scope.row)"
                     v-if="isBlank(scope.row.ask)">
            新增<i class="el-icon-news el-icon--right"/>
          </el-button>
          <el-button type="success" size="small"
                     @click="onClickEditAskAndAnswer(scope.row)"
                     v-else>
            编辑<i class="el-icon-document el-icon--right"/>
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

    <el-dialog title="问题" :visible.sync="formMeta.visible">
      <el-form :model="formData" :rules="formMeta.rules" ref="form" @submit.native.prevent>
        <el-form-item prop="id" label="Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
          <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
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
        <el-form-item prop="score" label="难度" :label-width="formMeta.labelWidth" required>
          <el-input-number v-model="formData.score" :min="0" :max="100"></el-input-number>
        </el-form-item>

        <el-form-item prop="type" label="类型" :label-width="formMeta.labelWidth" required>
          <el-select v-model.trim="formData.type" style="width: 100%" filterable>
            <el-option
              v-for="item in typeList"
              :key="item.code"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formMeta.visible = false">取消</el-button>
        <el-button type="primary" @click="onClickSubmit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="题目/答案" :visible.sync="askAndAnswerFormMeta.visible" width="1200px" top="10vh"
               :close-on-click-modal="false">
      <el-form :model="askAndAnswerFormData" :rules="askAndAnswerFormMeta.rules" ref="askAndAnswerForm"
               @submit.native.prevent>

        <el-form-item label="题目" :label-width="askAndAnswerFormMeta.labelWidth">
          <mavon-editor ref="askMd"
                        defaultOpen="preview"
                        v-model="askAndAnswerFormData.ask"
                        :toolbars="askAndAnswerFormMeta.toolbarConfig"
                        @imgAdd="onClickAskMdAddImage">
          </mavon-editor>
        </el-form-item>

        <el-form-item label="答案" :label-width="askAndAnswerFormMeta.labelWidth">
          <mavon-editor ref="answerMd"
                        defaultOpen="preview"
                        v-model="askAndAnswerFormData.answer"
                        :toolbars="askAndAnswerFormMeta.toolbarConfig"
                        @imgAdd="onClickAnswerMdAddImage">
          </mavon-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: end">
        <el-button v-if="askAndAnswerFormMeta.showRemoveBtn" type="danger" @click="onClickClearAskAndAnswer"
                   style="float: left">清除
        </el-button>
        <el-button @click="askAndAnswerFormMeta.visible = false">取消</el-button>
        <el-button type="primary" @click="onClickSubmitAskAndAnswer">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    name: 'QuestionAdmin',
    data () {
      return {
        typeList: [],
        courseList: [],
        teacherList: [],
        tableMeta: {
          operation: {change: true, remove: true},
          columns_start: [
            {prop: 'id', label: 'Id', width: 60},
            {prop: 'courseName', label: '课程', width: 200},
            {prop: 'score', label: '难度', width: 100}
          ],
          columns_end: [
            {prop: 'type', label: '类型', width: 100},
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
          LIKE_teacherName: '',
          EQ_type: '',
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
          courseId: null,
          courseName: '',
          score: 0,
          ask: '',
          answer: '',
          type: '',
          teacherId: null,
          teacherName: ''
        },
        askAndAnswerFormMeta: {
          visible: false,
          showRemoveBtn: true,
          labelWidth: '50px',
          rules: {
            ask: [
              {required: true, message: '问题不能为空', trigger: 'blur'}
            ],
            answer: [
              {required: true, message: '答案不能为空', trigger: 'blur'}
            ]
          },
          toolbarConfig: {
            bold: true, // 粗体
            italic: true, // 斜体
            header: true, // 标题
            underline: true, // 下划线
            strikethrough: true, // 中划线
            mark: true, // 标记
            superscript: true, // 上角标
            subscript: true, // 下角标
            quote: true, // 引用
            ol: true, // 有序列表
            ul: true, // 无序列表
            link: true, // 链接
            imagelink: true, // 图片链接
            code: true, // code
            table: true, // 表格
            fullscreen: true, // 全屏编辑
            readmodel: true, // 沉浸式阅读
            htmlcode: false, // 展示html源码
            help: true, // 帮助
            /* 1.3.5 */
            undo: true, // 上一步
            redo: true, // 下一步
            trash: true, // 清空
            save: false, // 保存（触发events中的save事件）
            /* 1.4.2 */
            navigation: true, // 导航目录
            /* 2.1.8 */
            alignleft: true, // 左对齐
            aligncenter: true, // 居中
            alignright: true, // 右对齐
            /* 2.2.1 */
            subfield: true, // 单双栏模式
            preview: true
          }
        },
        askAndAnswerFormData: {
          questionId: null,
          ask: '',
          answer: ''
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
        this.formData.courseId = null
        this.formData.courseName = ''
        this.formData.score = 0
        this.formData.ask = ''
        this.formData.answer = ''
        this.formData.type = ''
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
        this.formData.courseId = row.courseId
        this.formData.courseName = row.courseName
        this.formData.score = row.score
        this.formData.ask = row.ask
        this.formData.answer = row.answer
        this.formData.type = row.type
        this.formData.teacherId = row.teacherId
        this.formData.teacherName = row.teacherName

        this.formMeta.showId = true
        this.formMeta.nameDisabled = true
        this.formMeta.visible = true
      },
      onClickRemoveRow (row) {
        this.$confirm('您确定要删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.removeQuestionById(row.id).then(response => {
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
            this.$api.saveQuestion(this.formData).then(response => {
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
      onClickAskMdAddImage (pos, file) {
        this.$api.uploadFile(file).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.$refs['askMd'].$img2Url(pos, response.data.data.successes[0].url)
              break
            case Constant.FAILURE_CODE:
              console.error(response.data)
              this.$message.error('图片添加失败！')
          }
        })
      },
      onClickAnswerMdAddImage (pos, file) {
        this.$api.uploadFile(file).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.$refs['answerMd'].$img2Url(pos, response.data.data.successes[0].url)
              break
            case Constant.FAILURE_CODE:
              console.error(response.data)
              this.$message.error('图片添加失败！')
          }
        })
      },
      onClickAddAskAndAnswer (row) {
        this.askAndAnswerFormData.questionId = row.id
        this.askAndAnswerFormData.ask = ''
        this.askAndAnswerFormData.answer = ''

        this.askAndAnswerFormMeta.showRemoveBtn = false
        this.askAndAnswerFormMeta.visible = true
        // 避免首次加载对象不存在
        setTimeout(() => {
          if (this.$refs['askAndAnswerForm']) {
            this.$refs['askAndAnswerForm'].clearValidate()
          }
        }, 0)
      },
      onClickEditAskAndAnswer (row) {
        this.askAndAnswerFormData.questionId = row.id
        this.askAndAnswerFormData.ask = row.ask
        this.askAndAnswerFormData.answer = row.answer

        this.askAndAnswerFormMeta.showRemoveBtn = true
        this.askAndAnswerFormMeta.visible = true
      },
      onClickSubmitAskAndAnswer () {
        this.$api.editQuestionAskAndAnswer(this.askAndAnswerFormData.questionId,
          this.askAndAnswerFormData.ask, this.askAndAnswerFormData.answer).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.$message.success('保存成功！')
              this.askAndAnswerFormMeta.visible = false
              this.refreshTable()
              break
            case Constant.FAILURE_CODE:
              this.$message.error('保存失败！')
          }
        })
      },
      onClickClearAskAndAnswer () {
        this.$api.clearQuestionAskAndAnswer(this.askAndAnswerFormData.questionId).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.$message.success('清除成功！')
              this.askAndAnswerFormMeta.visible = false
              this.refreshTable()
              break
            case Constant.FAILURE_CODE:
              this.$message.error('保存失败！')
          }
        })
      },
      refreshTable () {
        this.$api.queryQuestion(this.queryFormData).then(response => {
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
