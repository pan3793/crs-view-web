<template>
  <div style="text-align: start;">
    <el-card>

      <div slot="header" style="display: flex; align-items: baseline">
        <h1>{{course.name}}</h1>
        <span style="padding-left: 20px">{{course.teacher}}</span>
      </div>

      <div style="display: flex">
        <div>
          <div>
            {{course.description}}
          </div>
        </div>

        <div style="padding-left: 20px">
          <img :src="course.imageUrl" style="max-width: 400px"/>
        </div>

      </div>
    </el-card>

    <div v-for="card in course.cards">
      <el-collapse value="1" style="margin: 10px 0">

        <el-card body-style="padding: 0 15px">
          <el-collapse-item name="1">

            <template slot="title">
              <div style="margin: 0 5px">
                <h2>{{card.title}}</h2>
              </div>
            </template>

            <mavon-editor v-if="!isBlank(card.content)"
                          :value="card.content"
                          default_open="preview"
                          :subfield="false"
                          :editable="false"
                          :toolbarsFlag="false"
                          style="margin: 5px">
            </mavon-editor>
            <div v-if="card.attachments && card.attachments.filter(it => it.type ==='video')"
                 style="display: flex; flex-wrap: wrap;">
              <div v-for="attachment in card.attachments.filter(it => it.type ==='video')"
                   style="padding: 25px; max-width: 350px; text-align: center">
                <div>
                  <video preload="metadata" :src="attachment.url" width="350"></video>
                </div>
                <div :title="attachment.name">{{truncate(attachment.name, 29)}}</div>
                <div style="padding-top: 10px">
                  <el-button type="primary" icon="el-icon-view">观看视频</el-button>
                </div>
              </div>
            </div>

            <div v-if="card.attachments && card.attachments.filter(it => it.type !== 'video')"
                 style="display: flex; flex-wrap: wrap; ">
              <div v-for="attachment in card.attachments.filter(it => it.type !== 'video')"
                   style="padding: 25px; max-width: 96px; text-align: center">
                <div>
                  <img v-if="attachment.type === 'word'" src="../assets/image/icon/word.png" width="96" height="96"/>
                  <img v-else-if="attachment.type === 'excel'" src="../assets/image/icon/excel.png" width="96"
                       height="96"/>
                  <img v-else-if="attachment.type === 'ppt'" src="../assets/image/icon/ppt.png" width="96" height="96"/>
                  <img v-else-if="attachment.type === 'pdf'" src="../assets/image/icon/pdf.png" width="96" height="96"/>
                  <img v-else-if="attachment.type === 'zip'" src="../assets/image/icon/zip.png" width="96" height="96"/>
                  <img v-else="attachment.type === 'other'" src="../assets/image/icon/other.png" width="96"
                       height="96"/>
                </div>
                <div :title="attachment.name">{{truncate(attachment.name, 9)}}</div>
                <div style="padding-top: 10px">
                  <el-button type="primary" icon="el-icon-download">下载</el-button>
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
  export default {
    data () {
      return {
        course: this.preset.course
      }
    },
    methods: {
      isBlank (str, chars = this._.whitespace) {
        return this._.trim(str, chars).length === 0
      },
      truncate (str, len) {
        return this._.truncate(str, {'length': len})
      }
    }
  }
</script>
