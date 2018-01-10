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
            <div style="display: flex; flex-wrap: wrap; ">
              <div v-for="i in 5" style="padding: 25px; max-width: 300px; text-align: center">
                <div>
                  <video preload="metadata" src="http://101.132.159.21:1999/testvideo.mp4" width="300"></video>
                </div>
                <div>我是标题</div>
                <div style="padding-top: 10px">
                  <el-button type="primary" icon="el-icon-view">观看视频</el-button>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; ">
              <div v-for="i in 5" style="padding: 25px; max-width: 300px; text-align: center">
                <div><img src="../assets/image/icon/word_icon.png" alt=""/></div>
                <div>我是标题</div>
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
      }
    }
  }
</script>

<style>

</style>

