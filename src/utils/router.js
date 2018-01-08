import Vue from 'vue'
import Router from 'vue-router'
import Framework from '@/views/Framework'
import Home from '@/components/Home'
import Classwork from '@/components/Classwork'
import CourseList from '@/components/CourseList'
import Exam from '@/components/Exam'
import Forum from '@/components/Forum'
import Course from '@/components/Course'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/home' },
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
    }
  ]
})
