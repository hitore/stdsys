<template>
	<div class="welcome">
		<h3 style="margin-bottom: 16px;">欢迎，{{name}}。您是{{powerArr[power - 1]}}。</h3>
		<Carousel autoplay :autoplay-speed="3000" v-model="index" loop>
	        <CarouselItem>
	            <div class="demo-carousel">
	            	<img src="../../assets/swiper_01.jpg">
	            </div>
	        </CarouselItem>
	        <CarouselItem>
	            <div class="demo-carousel">
	            	<img src="../../assets/swiper_02.jpg">
	            </div>
	        </CarouselItem>
	        <CarouselItem>
	            <div class="demo-carousel">
	            	<img src="../../assets/swiper_03.jpg">
	            </div>
	        </CarouselItem>
	    </Carousel>
	</div>
</template>
<script>
	export default{
		data() {
			return {
				index: 0,
				name: '',
				power: 2,
				powerArr: ['超级管理员', '普通管理员'],
			}
		},
		mounted() {
			this.$http({
				method: 'get',
			    url: '/api/check_login',
			}).then((res) => {
				if (res.data.status !== 0) {
					this.$router.replace({ name: 'login' });
				}
			});
			this.name = localStorage.user_name;
			this.power = localStorage.user_power;
		},
	}
</script>
<style>
	.welcome{
		width: 100%;
	}
	.demo-carousel{
		width: 100%;
	}
	.demo-carousel img{
		display: block;
		width: 100%;
	}
</style>