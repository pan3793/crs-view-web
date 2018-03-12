<template>
  <div style="padding: 20px 30px; text-align: start">
    <el-tabs type="card">
      <el-tab-pane label="课程管理">
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
          <el-table-column prop="cards" label="卡片" width="200">
            <template slot-scope="scope">
              <el-button type="success" size="small" plain>按钮</el-button>
              <el-button type="text" size="mini">新增</el-button>
            </template>
          </el-table-column>

          <el-table-column prop="imageUrl" label="图片" width="300">
            <template slot-scope="scope">
              <el-button type="success" size="small">
                预览<i class="el-icon-picture el-icon--right"/>
              </el-button>

              <el-button type="primary" size="small"
                         @click="onClickUploadImage(scope.row)">
                上传<i class="el-icon-upload el-icon--right"/>
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
              <el-input type="textarea" v-model.trim="formData.description" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="formMeta.visible = false">取消</el-button>
            <el-button type="primary" @click="onClickSubmit">确定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="上传图片" :visible.sync="uploadImageMeta.visible" width="400px" :close-on-click-modal="false">
          <el-upload
            :disabled="uploadImageMeta.disabled"
            accept="image/jpeg,image/png"
            action="/crs-file-server/api/file/upload"
            name="files"
            :limit="1"
            :file-list="uploadImageData.fileList"
            drag
            :show-file-list="true"
            :before-upload="beforeImageUpload"
            :on-success="onImageUploadSuccess"
            :on-error="onImageUploadError">
            <div v-loading="uploadImageMeta.loading" element-loading-text="正在上传，请稍后">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过10MB</div>
            </div>
          </el-upload>
        </el-dialog>

      </el-tab-pane>
      <el-tab-pane label="配置管理" closable>配置管理</el-tab-pane>
      <el-tab-pane label="配置管理" closable>配置管理</el-tab-pane>
      <el-tab-pane label="配置管理" closable>配置管理</el-tab-pane>
    </el-tabs>
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
        uploadImageMeta: {
          visible: false,
          disabled: false,
          loading: false
        },
        uploadImageData: {
          courseId: null,
          imageUrl: '',
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
      onClickAdd () {
        this.refreshTeacherIdNameList()
        this.refreshCategoryIdNameList()
        this.formData.id = null
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
      onClickUploadImage (row) {
        this.uploadImageData.fileList = []
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
      onImageUploadSuccess (response, file, fileList) {
        switch (response.code) {
          case Constant.SUCCESS_CODE:
            this.uploadImageData.imageUrl = response.data.successes[0].url
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
            console.error(response.data)
            this.uploadImageMeta.loading = false
        }
      },
      onImageUploadError (err, file, fileList) {
        console.error(err)
        this.$message.error('上传图片出错')
        this.uploadImageMeta.loading = false
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
