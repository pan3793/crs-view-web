<template>
  <div style="padding: 30px; text-align: start">
    <div>
      <el-button type="primary" @click="onClickAdd">添加</el-button>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="onClickChangeRow(scope.row)">修改</el-button>
          <el-button type="text" size="mini" @click="onClickRemoveRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="Id" width="60"></el-table-column>
      <el-table-column prop="name" label="名称" width="200"></el-table-column>
      <el-table-column prop="description" label="描述" width="300"></el-table-column>
      <el-table-column prop="creator" label="创建人" width="100"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
      <el-table-column prop="modifier" label="修改人" width="100"></el-table-column>
      <el-table-column prop="modifiedTime" label="修改时间" width="160"></el-table-column>
      <el-table-column prop="note" label="备注" min-width="200"></el-table-column>
    </el-table>

    <el-dialog title="分类" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent>
        <el-form-item label="Id" :label-width="formLabelWidth" v-if="showId">
          <el-input v-model="form.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onClickSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    name: 'CategoryAdmin',
    data () {
      return {
        tableData: [],
        dialogFormVisible: false,
        formLabelWidth: '50px',
        form: {
          'id': null,
          'name': null,
          'description': null,
          'note': null
        },
        showId: false,
        rules: {
          name: [{required: true, message: '名称不能为空'}]
        }
      }
    },
    mounted () {
      this.refreshTable()
    },
    methods: {
      onClickAdd () {
        this.form.id = null
        this.form.name = null
        this.form.description = null
        this.form.note = null

        this.showId = false
        this.dialogFormVisible = true
      },
      onClickChangeRow (row) {
        this.form.id = row.id
        this.form.name = row.name
        this.form.description = row.description
        this.form.note = row.note

        this.showId = true
        this.dialogFormVisible = true
      },
      onClickRemoveRow (row) {
        this.$confirm('您确定要删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.removeCategoryById(row.id).then(response => {
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
        this.$api.saveCategory(this.form).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.$message.success('修改成功！')
              this.dialogFormVisible = false
              this.refreshTable()
              break
            case Constant.FAILURE_CODE:
              this.$message.error('修改失败！')
          }
        })
      },
      refreshTable () {
        this.$api.fetchCategories().then(response => {
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
