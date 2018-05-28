<template>
	<div class="login">
		<Row class-name="login-row" type="flex" align="middle" :gutter="20">
	        <Col span="16" offset="2">
	        	<div class="welcome">
	        		<img src="../../assets/welcome.jpg">
	        	</div>
	        </Col>
	        <Col span="4">
	        	<div class="box">
	        		<p>华云学生成绩管理系统</p>
	        		<Input v-model="zhanghao" icon="person" placeholder="请输入账号" @on-enter="login"></Input>
	        		<Input v-model="password" type="password" icon="key" @on-enter="login" placeholder="请输入密码" style="margin-top: 20px;"></Input>
	        		<Button type="success" long style="margin-top: 20px;"  @click="login">登录</Button>
	        	</div>
	        </Col>
    	</Row>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				zhanghao: '',
				password: '',
			}
		},
		mounted() {
			this.$Notice.open({
                title: '欢迎',
                desc: '欢迎来到华云学生成绩管理系统，你可以在这里查看、修改学生信息。',
            });
		},
		methods: {
			handleSpinCustom () {
                this.$Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    type: 'load-c',
                                    size: 18
                                }
                            }),
                            h('div', 'Loading')
                        ])
                    }
                });
            },
			login() {
				const self = this;
				const zhanghao = this.zhanghao;
				const password = this.password;
				if (!zhanghao || !password) {
					this.$Message.warning('账号和密码不能为空');
					return;
				}
				this.handleSpinCustom();
				this.$http({
					method: 'post',
				    url: '/api/login',
				    data: {
				      user_name: zhanghao,
				      pass_word: password,
				    },
				}).then(function(res) {
					self.$Spin.hide();
					if (res.data.status === 0) {
						const user_info = res.data.data;
						localStorage.user_name = user_info.name;
						localStorage.user_power = user_info.power;
						localStorage.token = user_info.token;
						self.$Message.success('登录成功');
						self.$http.defaults.headers.common['Authorization'] = localStorage.token || '';
						self.$router.push({ name: 'welcome' });
					}
				});
			},
		},
	}
</script>
<style>
	.login{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
	.login .login-row{
		margin-top: 100px;
	}
	.login .welcome{
		width: 100%;
	}
	.login .welcome img{
		width: 100%;
	}
	.login .box{
		width: 100%;
		padding: 20px;
		border: 1px solid #5cadff;
		box-sizing: border-box;
		background: #fff;
		border-radius: 5px;
	}
	.login .box p{
		font-size: 14px;
		text-align: center;
		margin-bottom: 20px;
	}
</style>