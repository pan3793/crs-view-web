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
      <el-table-column v-for="item in tableMeta.columns_start"
                       :key="item.prop"
                       :prop="item.prop"
                       :label="item.label"
                       :width="item.width"
                       :min-width="item.minWidth"></el-table-column>
      <el-table-column prop='roleIds' label="角色" width="300">
        <template slot-scope="scope">
          {{ convertRoleIds2NamesString(scope.row.roleIds) }}
        </template>
      </el-table-column>
      <el-table-column prop='roleIds' label="重置密码" width="100">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="onClickResetPassword(scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
      <el-table-column v-for="item in tableMeta.columns_end"
                       :key="item.prop"
                       :prop="item.prop"
                       :label="item.label"
                       :width="item.width"
                       :min-width="item.minWidth"></el-table-column>
    </el-table>

    <el-dialog title="用户" :visible.sync="formMeta.visible">
      <el-form :model="formData" :rules="formMeta.rules" ref="form" @submit.native.prevent>
        <el-form-item prop="id" label="Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
          <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名" :label-width="formMeta.labelWidth" required>
          <el-input v-model.trim="formData.name" auto-complete="off" :disabled="formMeta.nameDisabled"></el-input>
        </el-form-item>
        <el-form-item prop="loginName" label="登录名" :label-width="formMeta.labelWidth">
          <el-input v-model.trim="formData.loginName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="roleIds" label="角色" :label-width="formMeta.labelWidth" required>
          <el-select v-model.trim="formData.roleIds" style="width: 100%" multiple>
            <el-option
              v-for="item in roleIdNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formMeta.visible = false">取消</el-button>
        <el-button type="primary" @click="onClickSubmit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="重置密码" :visible.sync="resetPasswordFormMeta.visible">
      <el-form :model="resetPasswordFormData" :rules="resetPasswordFormMeta.rules" ref="resetPasswordForm"
               @submit.native.prevent>
        <el-form-item prop="id" label="Id" :label-width="resetPasswordFormMeta.labelWidth" required>
          <el-input v-model.trim="resetPasswordFormData.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名" :label-width="resetPasswordFormMeta.labelWidth" required>
          <el-input v-model.trim="resetPasswordFormData.name" auto-complete="off"
                    disabled></el-input>
        </el-form-item>
        <el-form-item prop="loginName" label="登录名" :label-width="resetPasswordFormMeta.labelWidth" required>
          <el-input v-model.trim="resetPasswordFormData.loginName" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码" :label-width="resetPasswordFormMeta.labelWidth" required>
          <el-input type="password" v-model.trim="resetPasswordFormData.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="newPasswordAgain" label="新密码确认" :label-width="resetPasswordFormMeta.labelWidth" required>
          <el-input type="password" v-model.trim="resetPasswordFormData.newPasswordAgain"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordFormMeta.visible = false">取消</el-button>
        <el-button type="primary" @click="onClickSubmitResetPassword">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    name: 'UserAdmin',
    data () {
      let checkNewPasswordAgain = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.resetPasswordFormData.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        roleIdNameList: [],
        tableMeta: {
          operation: {change: true, remove: true},
          columns_start: [
            {prop: 'id', label: 'Id', width: 60},
            {prop: 'name', label: '姓名', width: 160},
            {prop: 'loginName', label: '登录名', width: 300}
          ],
          columns_end: [
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
          labelWidth: '70px',
          rules: {
            name: [
              {required: true, message: '姓名不能为空', trigger: 'blur'}
            ],
            loginName: [
              {required: true, message: '登录名不能为空', trigger: 'blur'}
            ]
          }
        },
        formData: {
          id: null,
          name: '',
          loginName: '',
          roleIds: []
        },
        resetPasswordFormMeta: {
          visible: false,
          labelWidth: '100px',
          rules: {
            name: [
              {required: true, message: '姓名不能为空', trigger: 'blur'}
            ],
            loginName: [
              {required: true, message: '登录名不能为空', trigger: 'blur'}
            ],
            newPassword: [
              {required: true, message: '新密码不能为空', trigger: 'blur'}
            ],
            newPasswordAgain: [
              {validator: checkNewPasswordAgain, trigger: 'blur'}
            ]
          }
        },
        resetPasswordFormData: {
          id: null,
          name: '',
          loginName: '',
          newPassword: '',
          newPasswordAgain: ''
        }
      }
    },
    mounted () {
      this.refreshTable()
      this.refreshRoleIdNameList()
    },
    methods: {
      onClickAdd () {
        this.formData.id = null
        this.formData.name = ''
        this.formData.loginName = ''
        this.formData.roleIds = []
        this.formMeta.showId = false
        this.formMeta.nameDisabled = false
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
        this.formData.loginName = row.loginName
        this.formData.roleIds = row.roleIds

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
          this.$api.removeUserById(row.id).then(response => {
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
      onClickResetPassword (row) {
        setTimeout(() => {
          if (this.$refs['resetPasswordForm']) {
            this.$refs['resetPasswordForm'].clearValidate()
          }
        }, 0)
        this.resetPasswordFormData.id = row.id
        this.resetPasswordFormData.name = row.name
        this.resetPasswordFormData.loginName = row.loginName
        this.resetPasswordFormData.newPassword = ''
        this.resetPasswordFormData.newPasswordAgain = ''

        this.resetPasswordFormMeta.visible = true
      },
      onClickSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$api.saveUser(this.formData).then(response => {
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
      onClickSubmitResetPassword () {
        this.$refs['resetPasswordForm'].validate((valid) => {
          if (valid) {
            this.$api.resetPasswordById(this.resetPasswordFormData.id, this.resetPasswordFormData.newPassword).then(response => {
              switch (response.data.code) {
                case Constant.SUCCESS_CODE:
                  this.$message.success('修改成功！')
                  this.resetPasswordFormMeta.visible = false
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
        this.$api.fetchUsers().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.tableData = response.data.data
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      },
      refreshRoleIdNameList () {
        this.$api.fetchRoleIdNameList().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.roleIdNameList = response.data.data
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      },
      convertRoleIds2NamesString (roleIds) {
        return roleIds.map(id => this.roleIdNameList
          .find(idName => idName.id === id))
          .filter(it => it !== undefined)
          .map(it => it.name).join('，')
      }
    }
  }
</script>

<style scoped>

</style>
