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

    <el-dialog title="访问控制列表" :visible.sync="formMeta.visible">
      <el-form :model="formData" :rules="formMeta.rules" ref="form" @submit.native.prevent>
        <el-form-item prop="id" label="Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
          <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth" required>
          <el-input v-model.trim="formData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="URL" :label-width="formMeta.labelWidth" required>
          <el-input v-model.trim="formData.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="anonymous" label="匿名" :label-width="formMeta.labelWidth" required>
          <el-switch v-model.trim="formData.anonymous"></el-switch>
        </el-form-item>
        <el-form-item prop="affirmative" label="完全授权" :label-width="formMeta.labelWidth" required>
          <el-switch v-model.trim="formData.affirmative"></el-switch>
        </el-form-item>
        <el-form-item prop="roleIds" label="授权角色" :label-width="formMeta.labelWidth" required>
          <el-input v-model.trim="formData.roleIds" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="priority" label="优先级" :label-width="formMeta.labelWidth" required>
          <el-input v-model.trim="formData.priority" auto-complete="off"></el-input>
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
    name: 'AclAdmin',
    data () {
      return {
        tableMeta: {
          operation: {change: true, remove: true},
          columns: [
            {prop: 'id', label: 'Id', width: 60},
            {prop: 'name', label: '名称', width: 200},
            {prop: 'url', label: 'URL', minWidth: 500},
            {prop: 'anonymous', label: '匿名', minWidth: 80},
            {prop: 'affirmative', label: '完全授权', minWidth: 80},
            {prop: 'roleIds', label: '授权角色', minWidth: 300},
            {prop: 'priority', label: '优先级', minWidth: 80},
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
          labelWidth: '80px',
          rules: {
            name: [
              {required: true, message: '名称不能为空', trigger: 'blur'}
            ]
          }
        },
        formData: {
          id: null,
          name: '',
          url: '',
          anonymous: false,
          affirmative: false,
          roleIds: '',
          priority: null
        }
      }
    },
    mounted () {
      this.refreshTable()
    },
    methods: {
      onClickAdd () {
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
          this.$api.removeAclById(row.id).then(response => {
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
            this.$api.saveAcl(this.formData).then(response => {
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
        this.$api.fetchAcls().then(response => {
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
