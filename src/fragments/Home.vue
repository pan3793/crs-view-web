<template>
  <div>
    <el-carousel :interval="4000" type="card" height="360px">
      <el-carousel-item v-for="item in 6" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>

    <el-row>
      <el-col :span="12" style="padding: 10px" v-for="i in 7" :key="i">
        <el-card>

          <div slot="header" style="text-align: start">
            计算机
          </div>

          <el-row>
            <el-col :span="12" v-for="i in 5" :key="i" style="padding: 15px">
              <el-card :body-style="{ padding: '0px' }">
                <img src="http://101.132.159.21/res/1.jpg" class="image">
                <div>
                  <el-button type="text" @click="goCourse()">精品课程</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </el-card>
      </el-col>

    </el-row>


  </div>
</template>

<script>
  export default {
    data () {
      return {
        currentDate: new Date()
      }
    },
    methods: {
      goCourse () {
        this.$router.push('/course/1')
      }
    }
  }
</script>

<style>
  /*跑马灯*/
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .image {
    width: 100%;
    display: block;
  }

</style>
