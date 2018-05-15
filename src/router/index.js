import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login/index.vue'
import index from '@/view/index.vue'
import welcome from '@/view/welcome'
import student from '@/view/checkStudent'
import teacher from '@/view/teacher'

// components
// import addStudent from '@/components/form/addStudent'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/',
      component: index,
      children: [
      	{
      		path: '',
      		name: 'welcome',
      		component: welcome,
      	},
      	{
      		path: 'student',
      		name: 'student',
      		component: student,
      	},
      	{
      		path: 'teacher',
      		name: 'teacher',
      		component: teacher,
      	},
      ],
    }
  ]
})
