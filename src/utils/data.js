export default {
  menus: [
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
          path: '/courseList?category=cs'
        },
        {
          title: '经济学',
          path: '/courseList?category=economic'
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
  categories: [
    {
      id: 1,
      name: '计算机'
    },
    {
      id: 2,
      name: '经济学'
    }
  ],
  courseCards: {
    id: 1,
    name: '货币金融学',
    teacher: '张教授',
    imageUrl: 'http://101.132.159.21/res/1.jpg'
  },
  course: {
    id: 1,
    name: '货币金融学',
    teacher: '张教授',
    imageUrl: 'http://101.132.159.21/res/1.jpg',
    description: '《货币金融学》是一本创新型金融学教材，在体系结构设计、知识面的涵盖方面整合了传统货币银行学与现代金融学的内容，' +
    '反映金融理论与金融实践发展，构建“宽口径”的金融学知识体系，体现金融学科与时俱进的时代特征。 本教材分为四篇，第一篇为金融学基础，' +
    '诠释货币、信用、利息、外汇、金融的基本原理；第二篇为金融机构与市场，介绍存款性金融机构、非存款性金融机构的主要业务活动，揭示货币' +
    '市场与资本市场的运行规律；第三篇为国际金融与全球化，分析国际间货币与资本运动的特殊性及相关经营管理体系，以及全球化的发展趋势；' +
    '第四篇为金融与经济发展，研究货币供应与需求、货币均衡、货币政策与宏观调控、金融风险与金融监管、金融与经济发展等问题。',
    cards: [
      {
        id: 1,
        name: '课程大纲',
        content: '# 《货币金融学》是一本创新型金融学教材，在体系结构设计、知识面的涵盖方面整合了传统货币银行学与现代金融学的内容，\n ' +
        '## 反映金融理论与金融实践发展，构建“宽口径”的金融学知识体系，体现金融学科与时俱进的时代特征。 本教材分为四篇，第一篇为金融学基础，\n ' +
        '诠释货币、信用、利息、外汇、金融的基本原理；第二篇为金融机构与市场，介绍存款性金融机构、非存款性金融机构的主要业务活动，揭示货币' +
        '市场与资本市场的运行规律；第三篇为国际金融与全球化，分析国际间货币与资本运动的特殊性及相关经营管理体系，以及全球化的发展趋势；\n ' +
        '## 诠释货币、信用、利息、外汇、金融的基本原理；第二篇为金融机构与市场，介绍存款性金融机构、非存款性金融机构的主要业务活动，揭示货币\n ' +
        '市场与资本市场的运行规律；第三篇为国际金融与全球化，分析国际间货币与资本运动的特殊性及相关经营管理体系，以及全球化的发展趋势；' +
        '诠释货币、信用、利息、外汇、金融的基本原理；第二篇为金融机构与市场，介绍存款性金融机构、非存款性金融机构的主要业务活动，揭示货币\n' +
        '## 市场与资本市场的运行规律；第三篇为国际金融与全球化，分析国际间货币与资本运动的特殊性及相关经营管理体系，以及全球化的发展趋势；\n ' +
        '诠释货币、信用、利息、外汇、金融的基本原理；第二篇为金融机构与市场，介绍存款性金融机构、非存款性金融机构的主要业务活动，揭示货币' +
        '市场与资本市场的运行规律；第三篇为国际金融与全球化，分析国际间货币与资本运动的特殊性及相关经营管理体系，以及全球化的发展趋势；' +
        '第四篇为金融与经济发展，研究货币供应与需求、货币均衡、货币政策与宏观调控、金融风险与金融监管、金融与经济发展等问题。'
      },
      {
        id: 2,
        name: '课件',
        content: '',
        files: [
          {
            name: 'word',
            type: 'word',
            url: ''
          },
          {
            name: '我是名字超长的的的的的的的的的的的的的的的的的的的的的的的的的的的的的的的的的excel',
            type: 'excel',
            url: ''
          },
          {
            name: 'ppt',
            type: 'ppt',
            url: ''
          },
          {
            name: 'pdf',
            type: 'pdf',
            url: ''
          },
          {
            name: 'zip',
            type: 'zip',
            url: ''
          },
          {
            name: 'file',
            type: 'other',
            url: ''
          }
        ]
      },
      {
        id: 3,
        name: '视频',
        content: '',
        files: [
          {
            name: '我是视频',
            type: 'video',
            url: 'http://101.132.159.21:1999/testvideo.mp4'
          },
          {
            name: '我是名字超长的的的的的的的的的的的的的的的的的的的的的的的的的的的的的的的的的视频',
            type: 'video',
            url: 'http://101.132.159.21:1999/testvideo.mp4'
          }
        ]
      },
      {
        id: 4,
        name: '参考资料',
        content: ''
      }
    ]
  },
  adminMenus: [
    {
      title: '权限管理',
      path: '/admin/auth',
      children: [
        {
          title: '用户管理',
          path: '/admin/auth/user'
        },
        {
          title: '角色管理',
          path: '/admin/auth/role'
        },
        {
          title: '访问控制列表',
          path: '/admin/auth/acl'
        }
      ]
    },
    // {
    //   title: '教师管理',
    //   path: '/admin/teacher'
    // },
    {
      title: '分类管理',
      path: '/admin/category'
    },
    {
      title: '课程管理',
      path: '/admin/course'
    },
    {
      title: '题库管理',
      path: '/admin/question'
    },
    {
      title: '作业管理',
      path: '/admin/classwork'
    },
    {
      title: '考试管理',
      path: '/admin/exam'
    },
    {
      title: '论坛管理',
      path: '/admin/forum'
    }
  ]
}
