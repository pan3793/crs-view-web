<template>
  <div style="min-height: 100%; display: flex; flex-direction: column;">

    <div style="z-index: 1000; width: 100%; height: 60px; padding: 0; background: white;">
      <div style="height: 60px; padding: 0">
        <TopBar/>
      </div>
      <!-- 我是分割线 -->
      <div style="height: 1px; background: #e6e6e6"></div>
    </div>

    <el-row type="flex" justify="center" style="flex: 1;">
      <div style="width: 1240px; padding: 20px;">
        <router-view/>
      </div>
    </el-row>

    <!-- 我是分割线 -->
    <div style="height: 1px; background: #e6e6e6"></div>

    <div style="height:60px; padding: 0">
      <BottomBar/>
    </div>

  </div>
</template>

<script>
  import TopBar from '@/components/TopBar'
  import BottomBar from '@/components/BottomBar'

  export default {
    name: 'Framework',
    components: {
      TopBar,
      BottomBar
    }
  }
</script>
