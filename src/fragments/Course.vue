<template>
  <div style="text-align: start;">
    <el-card>

      <div slot="header" style="display: flex; align-items: baseline">
        <h1>{{course.name}}</h1>
        <span style="padding-left: 20px">{{course.teacherName}}</span>
      </div>

      <div style="display: flex; justify-content: space-between">
        <div>
          {{course.description}}
        </div>

        <div v-if="!isBlank(course.imageUrl)" style="padding-left: 20px">
          <img :src="course.imageUrl" style=" max-width: 400px"/>
        </div>

      </div>
    </el-card>

    <div v-for="card in course.cards" :key="card.id">
      <el-collapse value="1" style="margin: 10px 0">

        <el-card body-style="padding: 0 15px">
          <el-collapse-item name="1">

            <template slot="title">
              <div style="margin: 0 5px">
                <h2>{{card.name}}</h2>
              </div>
            </template>

            <mavon-editor v-if="!isBlank(card.content)"
                          :value="card.content"
                          defaultOpen="preview"
                          :subfield="false"
                          :editable="false"
                          :toolbarsFlag="false"
                          style="margin: 5px">
            </mavon-editor>
            <div v-if="card.files && card.files.filter(it => it.type ==='video')"
                 style="display: flex; flex-wrap: wrap;">
              <div v-for="file in card.files.filter(it => it.type ==='video')"
                   style="padding: 25px; max-width: 350px; text-align: center">
                <div>
                  <video preload="metadata" :src="file.url" width="350"></video>
                </div>
                <div :title="file.name">{{truncate(file.name, 29)}}</div>
                <div style="padding-top: 10px">
                  <el-button type="primary" icon="el-icon-view" @click="openWindow(file.url)"> 观看视频</el-button>
                </div>
              </div>
            </div>

            <div v-if="card.files && card.files.filter(it => it.type !== 'video')"
                 style="display: flex; flex-wrap: wrap; ">
              <div v-for="file in card.files.filter(it => it.type !== 'video')"
                   style="padding: 25px; max-width: 96px; text-align: center">
                <div>
                  <img v-if="file.type === 'word'" src="../assets/image/icon/word.png" width="96" height="96"/>
                  <img v-else-if="file.type === 'excel'" src="../assets/image/icon/excel.png" width="96"
                       height="96"/>
                  <img v-else-if="file.type === 'ppt'" src="../assets/image/icon/ppt.png" width="96" height="96"/>
                  <img v-else-if="file.type === 'pdf'" src="../assets/image/icon/pdf.png" width="96" height="96"/>
                  <img v-else-if="file.type === 'zip'" src="../assets/image/icon/zip.png" width="96" height="96"/>
                  <img v-else src="../assets/image/icon/other.png" width="96" height="96"/>
                </div>
                <div :title="file.name">{{truncate(file.name, 9)}}</div>
                <div style="padding-top: 10px">
                  <el-button type="primary" icon="el-icon-download" @click="openWindow(file.url)">下载</el-button>
                </div>
              </div>
            </div>

          </el-collapse-item>
        </el-card>

      </el-collapse>

    </div>

  </div>
</template>

<script>
  import * as Constant from '../utils/constant'

  export default {
    data () {
      return {
        course: {}
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.refreshCourseDetail()
      })
    },
    watch: {
      '$route.params.id' (val) {
        this.refreshCourseDetail()
      }
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      truncate (str, len) {
        return this._.truncate(str, {'length': len})
      },
      openWindow (url) {
        window.open(url)
      },
      refreshCourseDetail () {
        this.$api.fetchCourseDetailById(this.$route.params.id).then(response => {
          switch (response.data.code) {
            case Constant.SUCCESS_CODE:
              this.course = response.data.data
              break
            case Constant.FAILURE_CODE:
              this.$message.error('数据加载失败！')
          }
        })
      }
    }
  }
</script>
