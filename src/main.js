// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import api from './api.js'

Vue.prototype.$api = api;
Vue.use(iView);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<router-view/>',
})
