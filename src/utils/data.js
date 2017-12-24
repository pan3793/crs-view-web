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
  ]
}
