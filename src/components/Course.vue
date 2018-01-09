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
      <el-collapse style="margin: 10px 0">
        <el-card body-style="padding: 0 15px">
          <el-collapse-item>
            <template slot="title">
              <div style="margin: 0 5px"><h2>{{card.title}}</h2></div>
            </template>
            <mavon-editor
              class="mavon-editor"
              :value="card.body"
              :subfield="false"
              :editable="true"
              default_open="preview"
              :toolbarsFlag="false"
              style="margin: 5px">
            </mavon-editor>
          </el-collapse-item>
        </el-card>
      </el-collapse>

    </div>

  </div>
</template>

<script>
  import data from '@/utils/data'

  export default {
    data () {
      return {
        course: data.course
      }
    }
  }
</script>

<style>

</style>

