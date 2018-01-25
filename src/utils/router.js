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
          path: 'auth'
        },
        {
          path: 'course'
        },
        {
          path: 'classwork'
        },
        {
          path: 'exam'
        },
        {
          path: 'forum'
        }
      ]
    }
  ]
})
