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
      <el-table-column prop="cardIds" label="卡片" width="400">
        <template slot-scope="scope">
          <el-tooltip content="编辑卡片"
                      v-for="card in scope.row.cards"
                      :key="card.id">
            <el-button @click="onClickChangeCard(scope.row.id, card.id)"
                       type="success"
                       size="small"
                       plain
                       style="margin: 4px 10px 4px 0">
              {{ card.name }}
            </el-button>
          </el-tooltip>
          <el-tooltip content="新增卡片">
            <el-button @click="onClickAddCard(scope.row.id)"
                       type="text"
                       icon="el-icon-plus"
                       style="margin: 0 10px 0 0">
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="imageUrl" label="图片" width="100">
        <template slot-scope="scope">
          <el-button type="success" size="small"
                     @click="onClickPreviewImage(scope.row)"
                     v-if="!isBlank(scope.row.imageUrl)">
            预览<i class="el-icon-picture el-icon--right"/>
          </el-button>

          <el-button type="primary" size="small"
                     @click="onClickUploadImage(scope.row)"
                     v-else>
            上传<i class="el-icon-upload el-icon--right"/>
          </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="description" label="描述" min-width="300">
        <template slot-scope="scope">
          <el-tooltip>
            <div slot="content" style="max-width: 500px">
              {{scope.row.description}}
            </div>
            <span>{{truncate(scope.row.description, 40)}}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column v-for="item in tableMeta.columns_end"
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
        <el-form-item prop="categoryId" label="分类Id" :label-width="formMeta.labelWidth">
          <el-input v-model.trim="formData.categoryId" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="categoryName" label="分类名称" :label-width="formMeta.labelWidth" required>
          <el-select v-model.trim="formData.categoryName" style="width: 100%" filterable
                     @change="onCategoryNameSelectChange" :disabled="formMeta.categoryNameDisabled">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="teacherId" label="教师Id" :label-width="formMeta.labelWidth" required>
          <el-input v-model.trim="formData.teacherId" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="teacherName" label="教师姓名" :label-width="formMeta.labelWidth" required>
          <el-select v-model.trim="formData.teacherName" style="width: 100%" filterable
                     @change="onTeacherNameSelectChange" :disabled="formMeta.teacherNameDisabled">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="description" label="描述" :label-width="formMeta.labelWidth">
          <el-input type="textarea" :rows="6" v-model.trim="formData.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formMeta.visible = false">取消</el-button>
        <el-button type="primary" @click="onClickSubmit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="预览图片" :visible.sync="previewImageMeta.visible" width="640px">
      <div style="text-align: center">
        <img :src="previewImageData.imageUrl" style="max-width: 600px; max-height: 480px;"/>
      </div>
      <div slot="footer" style="text-align: start">
        <el-button type="warning" @click="onClickChangeImage">更换</el-button>
        <el-button type="danger" @click="onClickRemoveImage">删除</el-button>
        <el-button @click="previewImageMeta.visible = false" style="float: right">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="上传图片" :visible.sync="uploadImageMeta.visible" width="400px" :close-on-click-modal="false">
      <el-upload
        :disabled="uploadImageMeta.disabled"
        accept="image/jpeg,image/png"
        action="/crs-file-server/api/file/upload"
        name="files"
        :limit="1"
        :file-list="uploadImageDataExt.fileList"
        drag
        :show-file-list="true"
        :before-upload="beforeImageUpload"
        :on-success="onImageUploadSuccess"
        :on-error="onImageUploadError">
        <div v-loading="uploadImageMeta.loading" element-loading-text="正在上传，请稍后">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </div>
        <div class="el-upload__tip" slot="tip" style="text-align: center">只能上传jpg/png文件，且不超过10MB</div>
      </el-upload>
    </el-dialog>

    <el-dialog title="卡片" :visible.sync="cardFormMeta.visible" width="1200px" top="10vh" :close-on-click-modal="false">

      <el-form :model="cardFormData" :rules="cardFormMeta.rules" ref="cardForm" @submit.native.prevent>
        <el-form-item prop="id" label="Id" :label-width="cardFormMeta.labelWidth" v-if="cardFormMeta.showId">
          <el-input v-model.trim="cardFormData.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name" label="标题" :label-width="cardFormMeta.labelWidth" required>
          <el-input v-model.trim="cardFormData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="cardFormMeta.labelWidth">
          <mavon-editor ref="md"
                        defaultOpen="preview"
                        v-model="cardFormData.content"
                        :toolbars="cardFormMeta.toolbarConfig"
                        @imgAdd="onClickMdAddImage">
          </mavon-editor>
        </el-form-item>

        <el-form-item label="附件" :label-width="cardFormMeta.labelWidth">
          <!--file-list只是初始列表，非双向绑定-->
          <el-upload
            multiple
            name="files"
            action="/crs-file-server/api/file/upload"
            :on-success="onCardFileUploadSuccess"
            :on-error="onCardFileUploadError"
            :before-remove="beforeRemoveCardFile"
            :on-remove="onCardFileRemove"
            :file-list="cardFormDataExt.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div class="el-upload__tip" slot="tip">单个附件最大支持50M</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: end">
        <el-button v-if="cardFormMeta.showRemoveBtn" type="danger" @click="onClickRemoveCard" style="float: left">删除
        </el-button>
        <el-button @click="cardFormMeta.visible = false">取消</el-button>
        <el-button type="primary" @click="onClickSubmitCard">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    name: 'CourseAdmin',
    data () {
      return {
        teacherList: [],
        categoryList: [],
        tableMeta: {
          operation: {change: true, remove: true},
          columns_start: [
            {prop: 'id', label: 'Id', width: 60},
            {prop: 'name', label: '名称', width: 200},
            {prop: 'categoryName', label: '分类', width: 100},
            {prop: 'teacherName', label: '教师', width: 100}
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
          teacherNameDisabled: false,
          categoryNameDisabled: false,
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
          categoryId: null,
          categoryName: '',
          teacherId: null,
          teacherName: '',
          description: ''
        },
        previewImageMeta: {
          visible: false
        },
        previewImageData: {
          courseId: null,
          imageUrl: ''
        },
        uploadImageMeta: {
          visible: false,
          disabled: false,
          loading: false
        },
        uploadImageData: {
          courseId: null,
          imageUrl: ''
        },
        uploadImageDataExt: {
          fileList: []
        },
        cardFormMeta: {
          visible: false,
          showId: false,
          showRemoveBtn: false,
          labelWidth: '50px',
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
        cardFormData: {
          id: null,
          name: '',
          content: '',
          fileIds: []
        },
        cardFormDataExt: {
          courseId: null,
          fileList: []
        }
      }
    },
    mounted () {
      this.refreshTable()
      this.refreshCategoryIdNameList()
      this.refreshTeacherIdNameList()
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      truncate (str, len) {
        return this._.truncate(str, {'length': len})
      },
      extractFileIds: function (fileList) {
        return this._.flatMap(fileList
          .filter(file => file.status === 'success')
          .map(file => file.response.data.successes || [])
        ).map(it => it.id)
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
      onClickAdd () {
        this.refreshTeacherIdNameList()
        this.refreshCategoryIdNameList()
        this.formData.id = null
        this.formData.name = ''
        this.formData.categoryId = null
        this.formData.categoryName = ''
        this.formData.teacherId = null
        this.formData.teacherName = ''
        this.formData.description = ''

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
        this.formData.categoryId = row.categoryId
        this.formData.categoryName = row.categoryName
        this.formData.teacherId = row.teacherId
        this.formData.teacherName = row.teacherName
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
      onClickPreviewImage (row) {
        this.previewImageData.courseId = row.id
        this.previewImageData.imageUrl = row.imageUrl
        this.previewImageMeta.visible = true
      },
      onClickChangeImage () {
        this.previewImageMeta.visible = false
        this.uploadImageDataExt.fileList = []
        this.uploadImageMeta.loading = false
        this.uploadImageMeta.disabled = false
        this.uploadImageData.courseId = this.previewImageData.courseId
        // 避免闪屏
        setTimeout(() => {
          this.uploadImageMeta.visible = true
        }, 300)
      },
      onClickRemoveImage () {
        this.$confirm('您确定要删除该图片吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.removeImageById(this.previewImageData.courseId).then(response => {
            switch (response.data.code) {
              case Constant.SUCCESS_CODE:
                this.$message.success('删除成功！')
                this.previewImageMeta.visible = false
                this.refreshTable()
                break
              case Constant.FAILURE_CODE:
                this.$message.error('操作失败！')
            }
          })
        }).catch(() => {
          // do nothing
        })
      },
      onClickUploadImage (row) {
        this.uploadImageDataExt.fileList = []
        this.uploadImageMeta.loading = false
        this.uploadImageMeta.disabled = false
        this.uploadImageMeta.visible = true
        this.uploadImageData.courseId = row.id
      },
      beforeImageUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt10M = file.size / 1024 / 1024 < 10

        if (!isJPG && !isPNG) {
          this.$message.error('上传图片必须是 JPG/PNG 格式!')
          return false
        }
        if (!isLt10M) {
          this.$message.error('上传图片大小不能超过 10MB!')
          return false
        }
        this.uploadImageMeta.loading = true
        return true
      },
      onImageUploadSuccess (data, file, fileList) {
        switch (data.code) {
          case Constant.SUCCESS_CODE:
            this.uploadImageData.imageUrl = data.data.successes[0].url
            this.$api.bindImageById(this.uploadImageData.courseId, this.uploadImageData.imageUrl).then(response => {
              switch (response.data.code) {
                case Constant.SUCCESS_CODE:
                  this.$message.success('设定图片成功！')
                  this.uploadImageMeta.visible = false
                  this.uploadImageMeta.loading = false
                  this.refreshTable()
                  break
                case Constant.FAILURE_CODE:
                  this.$message.error('绑定图片出错！')
                  console.error(response.data)
              }
            })
            break
          case Constant.FAILURE_CODE:
            this.$message.error('上传图片出错！')
            console.error(data.data)
            this.uploadImageMeta.loading = false
        }
      },
      onImageUploadError (err, file, fileList) {
        console.error(err)
        this.$message.error('上传图片出错')
        this.uploadImageMeta.loading = false
      },
      beforeRemoveCardFile (file, fileList) {
        return this.$confirm(`确定移除${file.name}？`)
      },
      onCategoryNameSelectChange (categoryName) {
        this.formData.categoryId = this.categoryList.find((it) => it.name === categoryName).id
      },
      onTeacherNameSelectChange (teacherName) {
        this.formData.teacherId = this.teacherList.find((it) => it.name === teacherName).id
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
      onClickAddCard (courseId) {
        this.cardFormData.id = null
        this.cardFormData.name = ''
        this.cardFormData.content = ''
        this.cardFormData.fileIds = []
        this.cardFormDataExt.courseId = courseId
        this.cardFormDataExt.fileList = []

        this.cardFormMeta.showId = false
        this.cardFormMeta.showRemoveBtn = false
        this.cardFormMeta.visible = true
        setTimeout(() => {
          if (this.$refs['cardForm']) {
            this.$refs['cardForm'].clearValidate()
          }
        }, 0)
      },
      onClickChangeCard (courseId, cardId) {
        this.$api.fetchCardById(cardId).then(cardResponse => {
          switch (cardResponse.data.code) {
            case Constant.SUCCESS_CODE:
              this.cardFormData.id = cardResponse.data.data.id
              this.cardFormData.name = cardResponse.data.data.name
              this.cardFormData.content = cardResponse.data.data.content
              this.cardFormDataExt.courseId = courseId
              this.cardFormMeta.showId = true
              this.cardFormMeta.showRemoveBtn = true
              this.cardFormMeta.visible = true
              // 获取文件列表
              this.$api.fetchFilesByIds(cardResponse.data.data.fileIds).then(fileResponse => {
                switch (fileResponse.data.code) {
                  case Constant.SUCCESS_CODE:
                    this.cardFormDataExt.fileList = fileResponse.data.data
                    this.cardFormDataExt.fileList.forEach(file => {
                      file['response'] = {data: {successes: file}}
                    })
                    break
                  case Constant.FAILURE_CODE:
                    this.$message.error('获取File信息失败！')
                }
              })
              break
            case Constant.FAILURE_CODE:
              this.$message.error('获取Card信息失败！')
          }
        })
      },
      onClickRemoveCard () {
        this.$confirm('您确定要删除该卡片吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.removeCardByCourseId(this.cardFormDataExt.courseId, this.cardFormData.id).then(response => {
            switch (response.data.code) {
              case Constant.SUCCESS_CODE:
                this.$message.success('删除成功！')
                this.cardFormMeta.visible = false
                this.refreshTable()
                break
              case Constant.FAILURE_CODE:
                this.$message.error('操作失败！')
            }
          })
        }).catch(() => {
          // do nothing
        })
      },
      onCardFileUploadSuccess (response, file, fileList) {
        this.cardFormData.fileIds = this.extractFileIds(fileList)
      },
      onCardFileUploadError (err, file, fileList) {
        console.error(err)
        this.cardFormData.fileIds = this.extractFileIds(fileList)
      },
      onCardFileRemove (file, fileList) {
        this.cardFormData.fileIds = this.extractFileIds(fileList)
      },
      onClickSubmitCard () {
        this.$refs['cardForm'].validate((valid) => {
          if (valid) {
            this.$api.saveCard(this.cardFormData).then(cardResponse => {
              switch (cardResponse.data.code) {
                case Constant.SUCCESS_CODE:
                  this.$api.bindCardById(this.cardFormDataExt.courseId, cardResponse.data.data.id).then(courseResponse => {
                    switch (courseResponse.data.code) {
                      case Constant.SUCCESS_CODE:
                        this.cardFormMeta.visible = false
                        this.$message.success('操作成功！')
                        this.refreshTable()
                        break
                      case Constant.FAILURE_CODE:
                        console.error(courseResponse.data)
                        this.$message.error('课程绑定卡片失败！')
                    }
                  })
                  break
                case Constant.FAILURE_CODE:
                  console.error(cardResponse.data)
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
      },
      refreshTeacherIdNameList () {
        this.$api.fetchTeacherIdNameList().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.teacherList = response.data.data
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      },
      refreshCategoryIdNameList () {
        this.$api.fetchCategoryIdNameList().then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.categoryList = response.data.data
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
