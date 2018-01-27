import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login/login'

Vue.use(Router)

export default new Router({
//	mode: 'history',
	base: __dirname,
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    }
  ]
})
