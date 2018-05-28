<template>
	<div>
		<Modal v-model="showForm" width="600">
			<p slot="header"></p>
	        <div>
	        	<Form ref="formValidate" :model="formValidate" :rules="rules" :label-width="80">
			        <FormItem label="教师姓名" prop="name">
			            <Input v-model="formValidate.name" placeholder="教师姓名"></Input>
			        </FormItem>
			        <FormItem label="职工号" prop="id">
			            <Input :disabled="checkMode" v-model="formValidate.id" placeholder="职工号"></Input>
			        </FormItem>
			        <FormItem label="性别" prop="sex">
			            <Select v-model="formValidate.sex">
			                <Option value="0">男</Option>
			                <Option value="1">女</Option>
			                <Option value="2">未知</Option>
			            </Select>
			        </FormItem>
			        <FormItem label="职位" prop="position">
			        	<Select v-model="formValidate.position">
			                <Option value="0">教师</Option>
			                <Option value="1">教授</Option>
			            </Select>
			        </FormItem>
			        <FormItem label="学院" prop="collage">
			            <Select v-model="formValidate.collage">
					        <Option v-for="item in collageList" :value="item.name" :key="item.id">{{ item.name }}</Option>
					    </Select>
			        </FormItem>
			    </Form>
	        </div>
	        <div slot="footer">
	            <Button v-if="mode == 0" @click="handleReset">重置</Button>
	            <Button v-if="mode == 1" @click="showForm = false">取消</Button>
	            <Button :loading="loading" v-if="mode == 0" type="primary" @click="submitForm">确定</Button>
	            <Button :loading="loading" v-if="mode == 1" type="primary" @click="handleModifly">修改</Button>
	        </div>
	    </Modal>
	</div>
</template>
<script>
	export default {
		computed: {
		},
		props: {
			showAddTeacher: {
				type: Boolean,
				default: false,
			},
			form: {
				type: Object,
			},
			mode: {
				type: Number,
				default: '0',
			},
		},
		data() {
			return {
				loading: false,
				showForm: false,
				collageList: [],
				formValidate: {
					name: '',
					id: '',
					sex: '',
					position: '',
					collage: '',
				},
				rules: {
					name: [
						{ required: true, message: '姓名不能为空', trigger: 'blur' },
					],
					id: [
						{ required: true, message: '职工号不能为空', trigger: 'blur' },
					],
					sex: [
						{ required: true, message: '性别不能为空', trigger: 'blur' },
					],
					position: [
						{ required: true, message: '职位不能为空', trigger: 'blur' },
					],
					collage: [
						{ required: true, message: '学院不能为空', trigger: 'blur' },
					],
				},
			}
		},
		watch: {
			showAddTeacher(val) {
				this.showForm = val;
				if (val) {
					this.formValidate = JSON.parse(JSON.stringify(this.form));
				}
			},
			showForm(val) {
				this.$emit('update:showAddTeacher', val);
			},
		},
		computed: {
			checkMode() {
				if (this.mode === 1) {
					return true;
				} else {
					return false;
				}
			},
		},
		mounted() {
			this.getCollageList();
		},
		methods: {
			getCollageList() {
				this.$http({
					method: 'get',
					url: '/api/other',
				}).then(res => {
					this.collageList = res.data.data.list;
				});
			},
			handleModifly() {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						// success
						this.loading = true;
						this.$http({
							method: 'post',
						    url: '/api/modifly_teacher',
						    data: {
						      tea_form: this.formValidate,
						    },
						}).then((res) => {
							this.loading = false;
							if (res.data.status === 0) {
								this.$Message.success('修改成功');
								this.showForm = false;
								this.$emit('success');
							}
						});
					}
				});
			},
			submitForm() {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						// success
						this.loading = true;
						this.$http({
							method: 'post',
						    url: '/api/add_teacher',
						    data: {
						      tea_form: this.formValidate,
						    },
						}).then((res) => {
							this.loading = false;
							if (res.data.status === 0) {
								this.$Message.success('添加成功');
								this.showForm = false;
								this.$emit('success');
							}
						});
					}
				});
			},
			handleReset () {
                this.$refs.formValidate.resetFields();
            },
		},
	}
</script>
<style>
	.form{
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0);
		z-index: 999;
		transition: all 1s;
	}
	.show{
		background: rgba(0, 0, 0, .5);
	}
</style>