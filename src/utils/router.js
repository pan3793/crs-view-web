import Vue from 'vue'
import Router from 'vue-router'
import Framework from '@/frameworks/Framework'
import AdminFramework from '@/frameworks/AdminFramework'
import Home from '@/fragments/Home'
import Classwork from '@/fragments/Classwork'
import CourseList from '@/fragments/CourseList'
import Exam from '@/fragments/Exam'
import Forum from '@/fragments/Forum'
import Course from '@/fragments/Course'
import UserAdmin from '@/fragments/UserAdmin'
import RoleAdmin from '@/fragments/RoleAdmin'
import AclAdmin from '@/fragments/AclAdmin'
import CategoryAdmin from '@/fragments/CategoryAdmin'
import CourseAdmin from '@/fragments/CourseAdmin'
import QuestionAdmin from '@/fragments/QuestionAdmin'
import ClassworkAdmin from '@/fragments/ClassworkAdmin'
import ExamAdmin from '@/fragments/ExamAdmin'
import ForumAdmin from '@/fragments/ForumAdmin'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/home'},
    {
      path: '/',
      component: Framework,
      children: [
        {
          path: 'home',
          component: Home
        },
        {
          path: 'classwork',
          component: Classwork
        },
        {
          path: 'courseList/:condition?',
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
          path: 'classwork',
          component: ClassworkAdmin
        },
        {
          path: 'exam',
          component: ExamAdmin
        },
        {
          path: 'forum',
          component: ForumAdmin
        }
      ]
    }
  ]
})
