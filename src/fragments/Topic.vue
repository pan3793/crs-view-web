<template>
  <div style="text-align: start">
    <el-card>
      <div slot="header">
        <span>
          <h2>{{topic.name}}</h2>
          <el-tag size="small">{{topic.blockName}}</el-tag>
          &nbsp;&nbsp; 创建者
          <el-tag type="success" size="small">{{topic.creator}}</el-tag>
          <el-tag type="warning" size="small">{{humanizeTime(topic.createTime)}}</el-tag>
          <span v-if="!isEmpty(topic.discussions)">
                &nbsp;&nbsp; 最新回复
                <el-tag type="warning" size="small">{{humanizeTime(topic.modifiedTime)}}</el-tag>
              </span>
        </span>
        <el-button type="primary" size="small" style="float: right;" @click="onClickReply(null)">回帖
        </el-button>
      </div>
      <mavon-editor v-if="!isBlank(topic.content)"
                    :value="topic.content"
                    :subfield="false"
                    :editable="false"
                    :toolbarsFlag="false"
                    defaultOpen="preview"
                    style="min-height: auto">
      </mavon-editor>
    </el-card>

    <el-card v-for="(discussion, index) in discussions" :key="discussion.id">
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
        <el-button type="primary" size="small" style="float: right" @click="onClickReply(discussion.id)">回复
        </el-button>
      </div>
    </el-card>

    <el-dialog title="发帖" :visible.sync="discussionFormMeta.visible" width="1200px" :close-on-click-modal="false">
      <el-form :model="discussionFormData" :rules="discussionFormMeta.rules" ref="discussionForm"
               @submit.native.prevent>
        <mavon-editor ref="md"
                      defaultOpen="preview"
                      v-model="discussionFormData.content"
                      :toolbars="discussionFormMeta.toolbarConfig"
                      @imgAdd="onClickMdAddImage">
        </mavon-editor>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: end">
        <el-button @click="discussionFormMeta.visible = false">取消</el-button>
        <el-button type="primary" @click="onClickSubmitDiscussion">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'
  import moment from 'moment'

  export default {
    name: 'topic',
    data () {
      return {
        blockList: [],
        topic: {},
        discussions: [],
        discussionFormMeta: {
          visible: false,
          labelWidth: '80px',
          rules: {
            content: [
              {required: true, message: '回复内容不能为空', trigger: 'blur'}
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
        discussionFormData: {
          id: null,
          topicId: null,
          content: '',
          replyId: null
        }
      }
    },
    created () {
      this.refreshBlockIdNameList()
    },
    mounted () {
      this.refreshTopicDetail()
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      isEmpty (list) {
        return (list == null || list === undefined || list.length === 0)
      },
      truncate (str, len) {
        return this._.truncate(str, {'length': len})
      },
      humanizeTime (time) {
        return moment(time).fromNow()
      },
      findDiscussionIndexById (discussionId) {
        let index = this.discussions.findIndex((value, index, arr) => {
          return value.id === discussionId
        })
        return index !== -1 ? index : null
      },
      onClickReply (replyId) {
        this.discussionFormData.id = null
        this.discussionFormData.topicId = this.$route.params.id
        this.discussionFormData.content = ''
        this.discussionFormData.replyId = replyId

        this.discussionFormMeta.visible = true
        // 避免首次加载对象不存在
        setTimeout(() => {
          if (this.$refs['discussionForm']) {
            this.$refs['discussionForm'].clearValidate()
          }
        }, 0)
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
      onClickSubmitDiscussion () {
        this.$refs['discussionForm'].validate((valid) => {
          if (valid) {
            this.$api.saveDiscussion(this.discussionFormData).then(discussionResponse => {
              switch (discussionResponse.data.code) {
                case Constant.SUCCESS_CODE:
                  this.$api.bindDiscussionById(this.$route.params.id, discussionResponse.data.data.id).then(topicResponse => {
                    switch (topicResponse.data.code) {
                      case Constant.SUCCESS_CODE:
                        this.discussionFormMeta.visible = false
                        this.$message.success('回复成功！')
                        this.refreshTopicDetail()
                        break
                      case Constant.FAILURE_CODE:
                        console.error(topicResponse.data)
                        this.$message.error('主题绑定回复失败！')
                    }
                  })
                  break
                case Constant.FAILURE_CODE:
                  console.error(discussionResponse.data)
                  this.$message.error('回复失败！')
              }
            })
          } else {
            return false
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
      },
      refreshTopicDetail () {
        this.$api.fetchTopicDetailById(this.$route.params.id).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.topic = response.data.data
              this.discussions = response.data.data.discussions
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      }
    }
  }
</script>

<style>
</style>
