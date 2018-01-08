export default {
  menuList: [
    {
      title: '精品课程',
      path: '/home'
    },
    {
      title: '分类',
      path: '/courseList',
      children: [
        {
          title: '计算机',
          path: '/courseList/cs'
        },
        {
          title: '经济学',
          path: '/courseList/ecnomic'
        }
      ]
    },
    {
      title: '作业',
      path: '/classwork'
    },
    {
      title: '在线考试',
      path: '/exam'
    },
    {
      title: '交流论坛',
      path: '/forum'
    }
  ],
  course: {
    name: '货币金融学',
    teacher: '张教授',
    imageUrl: '../assets/logo.png',
    description: '《货币金融学》是一本创新型金融学教材，在体系结构设计、知识面的涵盖方面整合了传统货币银行学与现代金融学的内容，' +
    '反映金融理论与金融实践发展，构建“宽口径”的金融学知识体系，体现金融学科与时俱进的时代特征。 本教材分为四篇，第一篇为金融学基础，' +
    '诠释货币、信用、利息、外汇、金融的基本原理；第二篇为金融机构与市场，介绍存款性金融机构、非存款性金融机构的主要业务活动，揭示货币' +
    '市场与资本市场的运行规律；第三篇为国际金融与全球化，分析国际间货币与资本运动的特殊性及相关经营管理体系，以及全球化的发展趋势；' +
    '第四篇为金融与经济发展，研究货币供应与需求、货币均衡、货币政策与宏观调控、金融风险与金融监管、金融与经济发展等问题。',
    cards: [
      {
        title: '课程大纲',
        body: ''
      },
      {
        title: '课件',
        body: '',
        attachments: []
      },
      {
        title: '视频',
        body: '',
        attachments: [
          {
            name: '',
            type: '',
            url: ''
          }
        ]
      },
      {
        title: '参考资料',
        body: ''
      }
    ]
  }
}
