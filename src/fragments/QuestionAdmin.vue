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

        <el-form-item label="批阅类型">
          <el-select v-model="queryFormData.EQ_checkType" placeholder="请选择" :clearable="true" style="width: 100px">
            <el-option v-for="checkType in checkTypeList"
                       :key="checkType.code"
                       :label="checkType.name"
                       :value="checkType.name"/>
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
        <el-form-item prop="score" label="分值" :label-width="formMeta.labelWidth" required>
          <el-input-number v-model="formData.score" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <!--TODO ask answer-->

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
        <el-form-item prop="checkType" label="批阅类型" :label-width="formMeta.labelWidth" required>
          <el-select v-model.trim="formData.checkType" style="width: 100%" filterable>
            <el-option
              v-for="item in checkTypeList"
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
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    name: 'QuestionAdmin',
    data () {
      return {
        typeList: [],
        checkTypeList: [],
        courseList: [],
        teacherList: [],
        tableMeta: {
          operation: {change: true, remove: true},
          columns_start: [
            {prop: 'id', label: 'Id', width: 60},
            {prop: 'courseName', label: '课程', width: 200},
            {prop: 'score', label: '分值', minWidth: 100}
          ],
          columns_end: [
            {prop: 'type', label: '类型', width: 100},
            {prop: 'checkType', label: '批阅类型', width: 100},
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
          EQ_checkType: '',
          P_NUM: 0,
          P_SIZE: 10
        },
        paginationMeta: {
          sizes: [3, 10, 20, 50],
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
          checkType: '',
          teacherId: null,
          teacherName: ''
        }
      }
    },
    mounted () {
      this.refreshTable()
      this.refreshTypeCodeNameList()
      this.refreshCheckTypeCodeNameList()
      this.refreshCourseIdNameList()
      this.refreshTeacherIdNameList()
    },
    methods: {
      onClickQuery () {
        this.refreshTable()
      },
      onClickAdd () {
        this.formData.id = null
        this.formMeta.showId = false
        this.formMeta.visible = true
        // 避免首次加载对象不存在
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      onClickChangeRow (row) {
        this.formData.id = row.id
        this.formData.courseId = row.courseId
        this.formData.courseName = row.courseName
        this.formData.score = row.score
        this.formData.ask = row.ask
        this.formData.answer = row.answer
        this.formData.type = row.type
        this.formData.checkType = row.checkType
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
      refreshCheckTypeCodeNameList () {
        this.$api.fetchQuestionCheckTypeList().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.checkTypeList = response.data.data
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
