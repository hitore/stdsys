import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import axios from 'axios';
import xlsx from 'xlsx';
import 'iview/dist/styles/iview.css';



Vue.config.productionTip = false
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = localStorage.token || '';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$http = axios;
Vue.prototype.$xlsx = xlsx;

Vue.use(iView);

axios.interceptors.request.use(function (config) {
	// 在发送请求之前做些什么
	axios.defaults.headers.common['Authorization'] = localStorage.token || '';
	return config;
}, function (error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
	// 对响应数据做点什么
	if (response.data.status !== 0) {
		iView.Message.error(response.data.msg);
	}
	if (response.data.status === 20002 || response.data.status === 20001) {
		router.replace({
			name: 'login'
		});
	}
	return response;
}, function (error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	render: h => h(App),
})