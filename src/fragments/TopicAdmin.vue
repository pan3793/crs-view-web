<template>
  <div style="padding: 30px; text-align: start">
    <div>
      <el-form :inline="true" :model="queryFormData" style="text-align: start; display: inline">
        <el-form-item label="版块">
          <el-select v-model="queryFormData.EQ_blockId" placeholder="请选择" :clearable="true" style="width: 100px">
            <el-option v-for="block in blockList"
                       :key="block.id"
                       :label="block.name"
                       :value="block.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="queryFormData.LIKE_name"></el-input>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="queryFormData.LIKE_keywords"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onClickQuery" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
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

      <el-table-column label="内容" width="150">
        <template slot-scope="scope">
          <el-button type="success" size="small"
                     @click="onClickPreviewContent(scope.row)">
            查看内容
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="回帖" width="150">
        <template slot-scope="scope">
          <el-button type="success" size="small"
                     @click="onClickPreviewDiscussions(scope.row)">
            预览回帖
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

    <el-dialog title="内容" :visible.sync="contentDialogMeta.visible">
      <mavon-editor :value="contentDialogMeta.content"
                    :subfield="false"
                    :editable="false"
                    :toolbarsFlag="false"
                    defaultOpen="preview"
                    style="min-height: auto">
      </mavon-editor>
      <div slot="footer" style="text-align: end">
        <el-button @click="contentDialogMeta.visible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="回帖" :visible.sync="discussionDialogMeta.visible">
      <el-card v-for="(discussion, index) in discussionDialogMeta.discussions" :key="discussion.id">
        <div style="margin-bottom: 10px; text-align: right">
          <el-tag size="small" type="danger" v-if="discussion.replyId">
            回复{{findDiscussionIndexById(discussion.replyId) + 1}}#
          </el-tag>
          <el-tag size="small" type="success">{{index + 1}}#</el-tag>
        </div>
        <mavon-editor v-if="!isBlank(discussion.content)"
                      :value="discussion.content"
                      :subfield="false"
                      :editable="false"
                      :toolbarsFlag="false"
                      defaultOpen="preview"
                      style="min-height: auto">
        </mavon-editor>
        <div style="margin-top: 10px">
          创建者
          <el-tag type="success" size="small">{{discussion.creator}}</el-tag>
          <el-tag type="warning" size="small">{{humanizeTime(discussion.createTime)}}</el-tag>
        </div>
      </el-card>
      <div slot="footer" style="text-align: end">
        <el-button @click="discussionDialogMeta.visible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'
  import moment from 'moment'

  export default {
    name: 'TopicAdmin',
    data () {
      return {
        blockList: [],
        tableMeta: {
          operation: {change: false, remove: true},
          columns_start: [
            {prop: 'id', label: 'Id', width: 60},
            {prop: 'blockName', label: '版块', width: 100},
            {prop: 'keywords', label: '关键字', width: 200},
            {prop: 'name', label: '标题', width: 300}
          ],
          columns_end: [
            {prop: 'creator', label: '创建人', width: 100},
            {prop: 'createTime', label: '创建时间', width: 160},
            {prop: 'modifier', label: '修改人', width: 100},
            {prop: 'modifiedTime', label: '修改时间', width: 160}
          ]
        },
        tableData: [],
        queryFormMeta: {},
        queryFormData: {
          EQ_blockId: null,
          LIKE_name: '',
          LIKE_keywords: '',
          P_NUM: 0,
          P_SIZE: 10
        },
        paginationMeta: {
          sizes: [3, 10, 20, 50],
          currentNumber: 1,
          size: 10,
          total: 0
        },
        contentDialogMeta: {
          visible: false,
          content: ''
        },
        discussionDialogMeta: {
          visible: false,
          discussions: []
        }
      }
    },
    mounted () {
      this.refreshTable()
      this.refreshBlockIdNameList()
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      isEmpty (list) {
        return (list == null || list === undefined || list.length === 0)
      },
      humanizeTime (time) {
        return moment(time).fromNow()
      },
      findDiscussionIndexById (discussionId) {
        let index = this.discussionDialogMeta.discussions.findIndex((value, index, arr) => {
          return value.id === discussionId
        })
        return index !== -1 ? index : null
      },
      onClickQuery () {
        this.refreshTable()
      },
      onClickRemoveRow (row) {
        this.$confirm('您确定要删除本条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.removeTopicById(row.id).then(response => {
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
      onClickPreviewContent (row) {
        this.contentDialogMeta.content = row.content
        this.contentDialogMeta.visible = true
      },
      onClickPreviewDiscussions (row) {
        this.$api.fetchTopicDetailById(row.id).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.discussionDialogMeta.discussions = response.data.data.discussions
              this.discussionDialogMeta.visible = true
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      },
      refreshTable () {
        this.$api.queryTopic(this.queryFormData).then(response => {
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
      refreshBlockIdNameList () {
        this.$api.fetchBlockIdNameList().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.blockList = response.data.data
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
