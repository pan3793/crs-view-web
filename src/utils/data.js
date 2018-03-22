export default {
  menus: [
    {
      title: '精品课程',
      path: '/home'
    },
    {
      title: '分类',
      path: '/courseList',
      children: []
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
