<template>
  <div style="padding: 20px 30px; text-align: start">
    <el-tabs type="card">
      <el-tab-pane label="课程管理">
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
          <el-table-column v-for="item in tableMeta.columns"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.label"
                           :width="item.width"
                           :min-width="item.minWidth"></el-table-column>
        </el-table>

        <el-dialog title="课程" :visible.sync="formMeta.visible">
          <el-form :model="formData" :rules="formMeta.rules" ref="form" @submit.native.prevent>
            <el-form-item prop="id" label="Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
              <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="id" label="分类Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
              <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item prop="name" label="分类名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="description" label="描述" :label-width="formMeta.labelWidth">
              <el-input type="textarea" v-model.trim="formData.description" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="id" label="Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
              <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="id" label="分类Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
              <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item prop="name" label="分类名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="description" label="描述" :label-width="formMeta.labelWidth">
              <el-input type="textarea" v-model.trim="formData.description" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="id" label="Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
              <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="id" label="分类Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
              <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item prop="name" label="分类名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
            </el-form-item>
            <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
              <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
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
      </el-tab-pane>
      <el-tab-pane label="配置管理" closable>配置管理</el-tab-pane>
      <el-tab-pane label="配置管理" closable>配置管理</el-tab-pane>
      <el-tab-pane label="配置管理" closable>配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    name: 'CourseAdmin',
    data () {
      return {
        tableMeta: {
          operation: {change: true, remove: true},
          columns: [
            {prop: 'id', label: 'Id', width: 60},
            {prop: 'name', label: '名称', width: 200},
            {prop: 'categoryName', label: '分类', width: 100},
            {prop: 'teacherName', label: '教师', width: 100},
            {prop: 'description', label: '描述', minWidth: 300},
            {prop: 'creator', label: '创建人', width: 100},
            {prop: 'createTime', label: '创建时间', width: 160},
            {prop: 'modifier', label: '修改人', width: 100},
            {prop: 'modifiedTime', label: '修改时间', width: 160}
          ]
        },
        tableData: [],
        formMeta: {
          visible: false,
          showId: false,
          nameDisabled: false,
          labelWidth: '50px',
          rules: {
            name: [
              {required: true, message: '名称不能为空', trigger: 'blur'}
            ]
          }
        },
        formData: {
          id: null,
          name: '',
          categoryId: null,
          categoryName: '',
          teacherId: null,
          teacherName: '',
          description: '',
          summary: '{}',
          content: '{}'
        }
      }
    },
    mounted () {
      this.refreshTable()
    },
    methods: {
      onClickAdd () {
        this.formData.id = null
        this.formMeta.showId = false
        this.formMeta.nameDisabled = false
        this.formMeta.visible = true
        // 避免首次加载对象不存在
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      onClickChangeRow (row) {
        this.formData.id = row.id
        this.formData.name = row.name
        this.formData.description = row.description

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
          this.$api.removeCourseById(row.id).then(response => {
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
      onClickSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$api.saveCourse(this.formData).then(response => {
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
      refreshTable () {
        this.$api.fetchCourses().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.tableData = response.data.data
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
