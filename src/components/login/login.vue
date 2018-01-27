<template>
	<div class="login">
		<video id="v" src="../../../static/loginvideo.mp4" autoplay loop></video>
		<div class="login-box" @mousemove="move = false" @mouseleave="move = true">
			<h2 class="title">学生成绩管理系统</h2>
			<div class="input-box" style="left:0px;top:0px;">
				<Input @on-enter="login" v-model="zhanghao" placeholder="请输入账号" style="margin-bottom: 30px;"></Input>
				<Input @on-enter="login" v-model="password" type="password" placeholder="请输入密码" style="margin-bottom: 30px;"></Input>
				<Button type="info" style="width: 100%;" @click="login">登录</Button>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				zhanghao: '',
				password: '',
				move: true,
				boxX: 0,
				boxY: 0,
				jishuX: 1,
				jishuY: 1,
			}
		},
		mounted(){
			document.getElementById('v').ondurationchange = function(){
				let h = this.offsetHeight - window.innerHeight;
				h = h/2;
				this.style.top = -h + 'px';
			}
			window.onresize = this.refreshVideo;
			this.welcome();
			this.roll();
			this.rollMove();
			this.setChangeStatus();
		},
		methods:{
			login(){
				const {zhanghao} = this;
				const {password} = this;
				if(zhanghao){
					if(password){
						this.errLogin();
					} else{
						this.warnPassword();
					}
				} else {
					this.warnZhanghao();
				}
			},
			setChangeStatus(){
				setInterval(this.changeStatus,3000);
			},
			changeStatus(){
				let x = this.$api.getStatus();
				const y = this.$api.getStatus();
				if (x === 0 && y === 0){
					console.log('相等了')
					this.changeStatus();
				} else {
					this.jishuX = x;
					this.jishuY = y;
				}
			},
			refreshVideo(){
				const v = document.getElementById('v');
				const h = window.innerHeight;
				const vh = v.offsetHeight;
				let c = vh - h;
				c = c/2;
				v.style.top = -c + 'px';
			},
			changeBoxBackground(){
				const el = document.getElementsByClassName('login-box')[0];
				const rgba = this.$api.getRgba();
				el.style.background = rgba;
			},
			roll(){
				setInterval(this.changeBoxBackground,3000);
			},
			changeBoxMove(){
				const el = document.getElementsByClassName('login-box')[0];
				const width = window.innerWidth;
				const height = window.innerHeight;
				const x = 2 * this.jishuX;
				const y = 2 * this.jishuY;
				const { move } = this;
				if(this.boxY >= height - 300){
					this.jishuY = -1;
				} else if(this.boxY < 0){
					this.jishuY = 1;
				}
				
				if(this.boxX >= width - 400){
					this.jishuX = -1;
				} else if(this.boxX < 0){
					this.jishuX = 1;
				}
				if(move){
					this.boxX += x;
					this.boxY += y;
					el.style.left = this.boxX + 'px';
					el.style.top = this.boxY + 'px';
				}
			},
			rollMove(){
				setInterval(this.changeBoxMove,30);
			},
			welcome(){
				this.$Notice.open({
		            title: '欢迎',
		            desc:  '欢迎进入华北科技学院学生成绩管理系统，你可以在这里查看、管理、修改学生成绩。',
		            duration: 0,
		        });
			},
			warnZhanghao(){
				this.$Message.warning('请输入账号！');
			},
			warnPassword(){
				this.$Message.warning('请输入密码！');
			},
			errLogin(){
				this.$Notice.error({
		            title: '错误',
		            desc:  '账号、密码不匹配',
		            duration: 2,
		        });
			},
		},
	}
</script>

<style>
	.login{
		position: relative;
		min-width: 1100px;
		width: 100%;
		height: 100%;
		background: #fff;
		overflow: hidden;
	}
	.login video{
		position: absolute;
		width: 100%;
		left: 0;
		top: 0;
	}
	.login-box{
		position: absolute;
		width: 400px;
		height: 300px;
		background: rgba(255,255,255,.8);
		border-radius: 10px;
		transition: background 3s linear;
		box-shadow: 0 0 10px 1px #22222b;
	}
	.login-box .title{
		color: #fff;
		text-align: center;
		margin: 25px 0;
	}
	.login-box .input-box{
		width: 300px;
		overflow: hidden;
		margin: 0 auto;
	}
</style>