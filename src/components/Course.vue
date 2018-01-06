<template>
  <div style="text-align: start;">
    <el-card>
      <div style="display: flex">
        <div>

          <h1>{{title}}</h1>

          <div style="height: 1px; background: #e6e6e6; margin: 10px 0"></div>

          <div>
            {{introduction}}
          </div>
        </div>

        <img src="../assets/logo.png" width="200" height="200"/>

      </div>
    </el-card>

    <div style="height: 10px;"></div>

    <el-collapse>
      <el-card body-style="padding: 0 20px 0 20px">
        <el-collapse-item name="1">
          <template slot="title">
            <div><h2>一致性 Consistency</h2></div>
          </template>
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>
      </el-card>
    </el-collapse>

    <div style="height: 10px;"></div>

    <el-collapse>
      <el-card body-style="padding: 0 20px 0 20px">
        <el-collapse-item name="2">
          <template slot="title">
            <h2>反馈 Feedback</h2>
          </template>
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
      </el-card>
    </el-collapse>

    <div style="height: 10px;"></div>

    <el-collapse>
      <el-card body-style="padding: 0 20px 0 20px">
        <el-collapse-item name="3">
          <template slot="title">
            <h2>效率 Efficiency</h2>
          </template>

          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </el-collapse-item>
      </el-card>
    </el-collapse>

    <div style="height: 10px;"></div>

    <el-collapse>
      <el-card body-style="padding: 0 20px 0 20px">
        <el-collapse-item name="4">
          <template slot="title">
            <h2>可控 Controllability</h2>
          </template>
          <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
          <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
        </el-collapse-item>
      </el-card>
    </el-collapse>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        title: '货币金融学',
        teacher: '张教授',
        introduction: '《货币金融学》是一本创新型金融学教材，在体系结构设计、知识面的涵盖方面整合了传统货币银行学与现代金融学的内容，反映金融理论与金融实践发展，构建“宽口径”的金融学知识体系，体现金融学科与时俱进的时代特征。 本教材分为四篇，第一篇为金融学基础，诠释货币、信用、利息、外汇、金融的基本原理；第二篇为金融机构与市场，介绍存款性金融机构、非存款性金融机构的主要业务活动，揭示货币市场与资本市场的运行规律；第三篇为国际金融与全球化，分析国际间货币与资本运动的特殊性及相关经营管理体系，以及全球化的发展趋势；第四篇为金融与经济发展，研究货币供应与需求、货币均衡、货币政策与宏观调控、金融风险与金融监管、金融与经济发展等问题。'
      }
    }
  }
</script>

<style>
  .el-collapse-item__content {
    padding-bottom: 10px;
  }
</style>

