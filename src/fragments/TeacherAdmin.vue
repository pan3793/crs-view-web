<template>
  <div style="padding: 30px; text-align: start">
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

    <el-dialog title="教师" :visible.sync="formMeta.visible">
      <el-form :model="formData" :rules="formMeta.rules" ref="form" @submit.native.prevent>
        <el-form-item prop="id" label="Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
          <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="userId" label="用户Id" :label-width="formMeta.labelWidth" required>
          <el-input v-model.trim="formData.userId" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="userName" label="姓名" :label-width="formMeta.labelWidth" required>
          <el-select v-model.trim="formData.userName" style="width: 100%" filterable @change="onUserNameSelectChange" :disabled="formMeta.userNameDisabled">
            <el-option
              v-for="item in formMeta.userList"
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
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    name: 'TeacherAdmin',
    data () {
      return {
        tableMeta: {
          operation: {change: true, remove: true},
          columns: [
            {prop: 'id', label: 'Id', width: 60},
            {prop: 'userId', label: '用户Id', width: 70},
            {prop: 'userName', label: '姓名', width: 200},
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
          userNameDisabled: false,
          labelWidth: '70px',
          userList: []
        },
        formData: {
          id: null,
          userId: null,
          userName: '',
          description: ''
        }
      }
    },
    computed: {
      // 索引，辅助查找
      userNameIdMap () {
        return new Map(this.formMeta.userList.map((it) => [it.name, it.id]))
      }
    },
    mounted () {
      this.refreshTable()
    },
    methods: {
      onClickAdd () {
        this.refreshUserIdNameList()
        this.formMeta.showId = false
        this.formMeta.userNameDisabled = false
        this.formMeta.visible = true
        // 避免首次加载对象不存在
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      onClickChangeRow (row) {
        this.formData.id = row.id
        this.formData.userId = row.userId
        this.formData.userName = row.userName
        this.formData.description = row.description

        this.formMeta.showId = true
        this.formMeta.userNameDisabled = true
        this.formMeta.visible = true
      },
      onClickRemoveRow (row) {
        this.$confirm('您确定要删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.removeTeacherById(row.id).then(response => {
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
      onUserNameSelectChange (userName) {
        // this.formData.userId = this.userNameIdMap.get(userName)
        this.formData.userId = this.formMeta.userList.find((it) => it.name === userName).id
      },
      onClickSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$api.saveTeacher(this.formData).then(response => {
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
        this.$api.fetchTeachers().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.tableData = response.data.data
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      },
      refreshUserIdNameList () {
        this.$api.fetchUserIdNameList().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.formMeta.userList = response.data.data
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
