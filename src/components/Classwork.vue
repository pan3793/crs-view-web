<template>
  <div>
    <div>Classwork</div>
    <mavon-editor
      :value="value"
      :subfield="false"
      :editable="true"
      default_open="preview"
      :toolbarsFlag="false">
    </mavon-editor>
  </div>
</template>


<script>
  export default {
    data () {
      return {
        value: '# 标题一 \n## 标题二'
      }
    }
  }
</script>
