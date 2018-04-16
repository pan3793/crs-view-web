<template>
  <div style="padding: 30px; text-align: start">
    <div>
      <el-form :inline="true" :model="queryFormData" style="text-align: start">
        <el-form-item label="名称">
          <el-input v-model="queryFormData.LIKE_name"></el-input>
        </el-form-item>
        <el-form-item label="Url">
          <el-input v-model="queryFormData.LIKE_url"></el-input>
        </el-form-item>
        <el-form-item label="匿名访问">
          <el-select v-model="queryFormData.EQ_anonymous" placeholder="请选择" :clearable="true">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
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

      <el-table-column prop="anonymous" label="匿名访问" width="80">
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.anonymous === true ? 'success' : 'danger'" disable-transitions>
            {{ scope.row.anonymous === true ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop='affirmative' label="完全授权" width="80">
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.anonymous" size="small" :type="scope.row.affirmative === true ? 'success' : 'danger'"
                  disable-transitions>
            {{ scope.row.affirmative === true ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop='roleIds' label="授权角色" width="300">
        <template v-if="!scope.row.anonymous" slot-scope="scope">
          {{ convertRoleIds2NamesString(scope.row.roleIds) }}
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
        <el-form-item prop="anonymous" label="匿名访问" :label-width="formMeta.labelWidth" required>
          <el-switch v-model="formData.anonymous"></el-switch>
        </el-form-item>
        <el-form-item v-if="!formData.anonymous"
                      prop="affirmative" label="完全授权" :label-width="formMeta.labelWidth" required>
          <el-switch v-model="formData.affirmative"></el-switch>
        </el-form-item>
        <el-form-item v-if="!formData.anonymous"
                      prop="roleIds" label="授权角色" :label-width="formMeta.labelWidth">
          <el-select v-model.trim="formData.roleIds" style="width: 100%" multiple>
            <el-option
              v-for="item in roleIdNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="priority" label="优先级" :label-width="formMeta.labelWidth" required>
          <el-input-number v-model="formData.priority"></el-input-number>
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
        roleIdNameList: [],
        tableMeta: {
          operation: {change: true, remove: true},
          columns_start: [
            {prop: 'id', label: 'Id', width: 60},
            {prop: 'name', label: '名称', width: 200},
            {prop: 'url', label: 'URL', width: 500}
          ],
          columns_end: [
            {prop: 'priority', label: '优先级', width: 80},
            {prop: 'creator', label: '创建人', width: 100},
            {prop: 'createTime', label: '创建时间', width: 160},
            {prop: 'modifier', label: '修改人', width: 100},
            {prop: 'modifiedTime', label: '修改时间', width: 160}
          ]
        },
        queryFormMeta: {},
        queryFormData: {
          LIKE_name: '',
          LIKE_url: '',
          EQ_anonymous: null,
          P_NUM: 0,
          P_SIZE: 10,
          O_priority_ASC: 1
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
          roleIds: [],
          priority: 0
        }
      }
    },
    mounted () {
      this.refreshTable()
      this.refreshRoleIdNameList()
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
        this.formData.name = ''
        this.formData.url = ''
        this.formData.anonymous = false
        this.formData.affirmative = false
        this.formData.roleIds = []
        this.formData.priority = 0

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
        this.formData.url = row.url
        this.formData.anonymous = row.anonymous
        this.formData.affirmative = row.affirmative
        this.formData.roleIds = row.roleIds
        this.formData.priority = row.priority

        this.formMeta.showId = true
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
        this.$api.queryAcl(this.queryFormData).then(response => {
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
