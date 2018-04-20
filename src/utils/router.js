import Vue from 'vue'
import Router from 'vue-router'
import Framework from '@/frameworks/Framework'
import AdminFramework from '@/frameworks/AdminFramework'
import Login from '@/frameworks/Login'
import Home from '@/fragments/Home'
import CourseList from '@/fragments/CourseList'
import Exam from '@/fragments/Exam'
import Forum from '@/fragments/Forum'
import Course from '@/fragments/Course'
import Topic from '@/fragments/Topic'
import UserAdmin from '@/fragments/UserAdmin'
import RoleAdmin from '@/fragments/RoleAdmin'
import AclAdmin from '@/fragments/AclAdmin'
import CategoryAdmin from '@/fragments/CategoryAdmin'
import CourseAdmin from '@/fragments/CourseAdmin'
import QuestionAdmin from '@/fragments/QuestionAdmin'
import ExamAdmin from '@/fragments/ExamAdmin'
import BlockAdmin from '@/fragments/BlockAdmin'
import TopicAdmin from '@/fragments/TopicAdmin'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/home'},
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Framework,
      children: [
        {
          path: 'home',
          component: Home
        },
        {
          path: 'courseList',
          component: CourseList
        },
        {
          path: 'exam',
          component: Exam
        },
        {
          path: 'forum',
          component: Forum
        },
        {
          path: 'course/:id',
          component: Course
        },
        {
          path: 'topic/:id',
          name: 'topic',
          component: Topic
        }
      ]
    },
    {
      path: '/admin',
      component: AdminFramework,
      children: [
        {
          path: 'auth/user',
          component: UserAdmin
        },
        {
          path: 'auth/role',
          component: RoleAdmin
        },
        {
          path: 'auth/acl',
          component: AclAdmin
        },
        {
          path: 'category',
          component: CategoryAdmin
        },
        {
          path: 'question',
          component: QuestionAdmin
        },
        {
          path: 'course',
          component: CourseAdmin
        },
        {
          path: 'exam',
          component: ExamAdmin
        },
        {
          path: 'forum/block',
          component: BlockAdmin
        },
        {
          path: 'forum/topic',
          component: TopicAdmin
        }
      ]
    }
  ]
})
