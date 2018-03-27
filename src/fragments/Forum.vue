<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <el-form :inline="true" :model="queryFormData" style="text-align: start; display: inline">
        <el-form-item label="标题">
          <el-input v-model="queryFormData.LIKE_name"></el-input>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="queryFormData.LIKE_keywords"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
      <span><el-button type="success" @click="onClickAddTopic">发表新帖</el-button></span>
    </div>

    <el-tabs v-model="activeBlockId" type="card" @tab-click="onBlockTabClick">
      <el-tab-pane label="全部" name=""></el-tab-pane>
      <el-tab-pane
        v-for="block in blockList"
        :key="block.id"
        :label="block.name"
        :name="block.id.toString()">
      </el-tab-pane>
    </el-tabs>

    <div>
      <el-card>
        <div style="display: flex; justify-content: space-between">
          <div style="text-align: left">
            <h2>我是标题</h2>
            <div>版块 / 创建者 / 创建时间 / 最新回复 回复者 / 回复时间</div>
          </div>

          <el-badge :value="222" :max="99"/>

        </div>
      </el-card>

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
    </div>

    <el-dialog title="发帖" :visible.sync="topicFormMeta.visible" width="1200px" top="10vh" :close-on-click-modal="false">

      <el-form :model="topicFormData" :rules="topicFormMeta.rules" ref="topicForm" @submit.native.prevent>
        <el-form-item prop="id" label="Id" :label-width="topicFormMeta.labelWidth" v-if="topicFormMeta.showId">
          <el-input v-model.trim="topicFormData.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="版块">
          <el-select v-model="topicFormData.blockId" placeholder="请选择" :clearable="true">
            <el-option v-for="block in blockList"
                       :key="block.id"
                       :label="block.name"
                       :value="block.id"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="keywords" label="关键字" :label-width="topicFormMeta.labelWidth" required>
          <el-input v-model.trim="topicFormData.keywords" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="标题" :label-width="topicFormMeta.labelWidth" required>
          <el-input v-model.trim="topicFormData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="topicFormMeta.labelWidth">
          <mavon-editor ref="md"
                        default_open="preview"
                        v-model="topicFormData.content"
                        :toolbars="topicFormMeta.toolbarConfig"
                        @imgAdd="onClickMdAddImage">
          </mavon-editor>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: end">
        <el-button @click="topicFormMeta.visible = false">取消</el-button>
        <el-button type="primary" @click="onClickSubmitTopic">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'
  // import moment from 'moment'

  export default {
    name: 'Forum',
    data () {
      return {
        blockList: [],
        queryFormMeta: {},
        queryFormData: {
          EQ_BlockId: null,
          LIKE_keywords: '',
          LIKE_name: '',
          EQ_creator: '',
          P_NUM: 0,
          P_SIZE: 10,
          O_modifiedTime_DESC: 0
        },
        activeBlockId: '',
        paginationMeta: {
          sizes: [4, 10, 20, 50],
          currentNumber: 1,
          size: 10,
          total: 0
        },
        topicFormMeta: {
          visible: false,
          labelWidth: '80px',
          rules: {
            name: [
              {required: true, message: '标题不能为空', trigger: 'blur'}
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
        topicFormData: {
          id: null,
          blockId: null,
          keywords: '',
          name: '',
          content: ''
        }
      }
    },
    mounted () {
      this.refreshBlockIdNameList()
    },
    methods: {
      onSubmit () {

      },
      onClickAddTopic () {
        this.topicFormData.id = null
        this.topicFormData.blockId = null
        this.topicFormData.keywords = ''
        this.topicFormData.name = ''
        this.topicFormData.content = ''

        this.topicFormMeta.visible = true
        // 避免首次加载对象不存在
        setTimeout(() => {
          if (this.$refs['topicForm']) {
            this.$refs['topicForm'].clearValidate()
          }
        }, 0)
      },
      onBlockTabClick (tab, event) {
        this.queryFormData.EQ_BlockId = tab.name
        this.refreshTopicList()
      },
      onPageNumChange (pageNum) {
        this.queryFormData.P_NUM = pageNum - 1
        this.refreshTopicList()
      },
      onPageSizeChange (pageSize) {
        this.queryFormData.P_SIZE = pageSize
        this.refreshTopicList()
      },
      onClickMdAddImage (pos, file) {
        this.$api.uploadFile(file).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.$refs['md'].$img2Url(pos, response.data.data.successes[0].url)
              break
            case Constant.FAILURE_CODE:
              console.error(response.data)
              this.$message.error('图片添加失败！')
          }
        })
      },
      onClickSubmitTopic () {

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
      },
      refreshTopicList () {
        console.log('refreshTopicList', this.queryFormData.EQ_BlockId)
      }
    }
  }
</script>
