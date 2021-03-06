<template>
  <div style="padding: 30px; text-align: start">
    <div>
      <el-form :inline="true" :model="queryFormData" style="text-align: start">
        <el-form-item label="编码">
          <el-input v-model="queryFormData.LIKE_code"></el-input>
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
      <el-table-column v-for="item in tableMeta.columns"
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

    <el-dialog title="角色" :visible.sync="formMeta.visible">
      <el-form :model="formData" :rules="formMeta.rules" ref="form" @submit.native.prevent>
        <el-form-item prop="id" label="Id" :label-width="formMeta.labelWidth" v-if="formMeta.showId">
          <el-input v-model.trim="formData.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="code" label="编码" :label-width="formMeta.labelWidth" required>
          <el-input v-model.trim="formData.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="名称" :label-width="formMeta.labelWidth">
          <el-input v-model.trim="formData.name" auto-complete="off"></el-input>
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
    name: 'RoleAdmin',
    data () {
      return {
        tableMeta: {
          operation: {change: true, remove: true},
          columns: [
            {prop: 'id', label: 'Id', width: 60},
            {prop: 'code', label: '编码', width: 200},
            {prop: 'name', label: '名称', width: 300},
            {prop: 'creator', label: '创建人', width: 100},
            {prop: 'createTime', label: '创建时间', width: 160},
            {prop: 'modifier', label: '修改人', width: 100},
            {prop: 'modifiedTime', label: '修改时间', width: 160}
          ]
        },
        queryFormMeta: {},
        queryFormData: {
          LIKE_code: '',
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
        tableData: [],
        formMeta: {
          visible: false,
          showId: false,
          labelWidth: '70px',
          rules: {
            code: [
              {required: true, message: '编码不能为空', trigger: 'blur'}
            ],
            name: [
              {required: true, message: '名称不能为空', trigger: 'blur'}
            ]
          }
        },
        formData: {
          id: null,
          code: '',
          name: ''
        }
      }
    },
    mounted () {
      this.refreshTable()
    },
    methods: {
      truncate (str, len) {
        return this._.truncate(str, {'length': len})
      },
      onClickQuery () {
        this.refreshTable()
      },
      onPageNumChange (pageNum) {
        this.queryFormData.P_NUM = pageNum - 1
        this.refreshTable()
      },
      onPageSizeChange (pageSize) {
        this.queryFormData.P_SIZE = pageSize
        this.refreshTable()
      },
      onClickAdd () {
        this.formData.id = null
        this.formData.code = ''
        this.formData.name = ''
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
        this.formData.code = row.code
        this.formData.name = row.name

        this.formMeta.showId = true
        this.formMeta.visible = true
      },
      onClickRemoveRow (row) {
        this.$confirm('您确定要删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.removeRoleById(row.id).then(response => {
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
            this.$api.saveRole(this.formData).then(response => {
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
        this.$api.queryRole(this.queryFormData).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.tableData = response.data.data.content
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

<style scoped>

</style>
