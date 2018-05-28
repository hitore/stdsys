<template>
  <div class="other">
  	<Row>
        <Col span="24">
        	<div class="flex">
        		<p class="title">学院</p>
        		<Button @click="handleAdd('collage')" type="ghost" icon="plus-round"></Button>
        	</div>
        </Col>
        <Col span="24" class="block">
        	<Tag
        		type="dot"
        		closable
        		:color="color[index % 4]"
        		v-for="(item,index) in list"
        		:key="item.id"
        		@on-close="delectCollage(item.id)">{{item.name}}</Tag>
        </Col>
    </Row>
    <Row>
        <Col span="24">
        	<div class="flex">
        		<p class="title">专业</p>
        		<Button @click="handleAdd('speciality')" type="ghost" icon="plus-round"></Button>
        	</div>
        </Col>
        <Col span="24" class="block">
		    <span
		    	v-for="(item,index) in list"
        		:key="item.id">
        		<span
        			v-for="(item2,index2) in item.speciality"
        			:key="index2">
        			<Tag
        				type="dot"
        				closable
        				:color="color[index % 4]"
        				@on-close="delectSpeciality(item.id,item2.name)">{{item2.name}}</Tag>
        		</span>
        	</span>
        </Col>
    </Row>
    <Row>
        <Col span="24">
        	<div class="flex">
        		<p class="title">班级</p>
        		<Button @click="handleAdd('class')" type="ghost" icon="plus-round"></Button>
        	</div>
        </Col>
        <Col span="24" class="block">
        	<span
		    	v-for="(item,index) in list"
        		:key="item.id">
        		<span
        			v-for="(item2,index2) in item.speciality"
        			:key="index2">
        			<span
        				v-for="(item3,index3) in item2.class"
        				:key="index3">
        				<Tag
	        				type="dot"
	        				closable
	        				:color="color[index % 4]"
	        				@on-close="delectClass(item.id,index2,item3)">{{item3}}</Tag>
        			</span>
        		</span>
        	</span>
        </Col>
    </Row>
    <Modal
        :title="modalTitle"
        v-model="showModal"
        class-name="vertical-center-modal">
        <div class="flex" v-if="mode == 'speciality'">
        	<Select v-model="collageId" style="width:200px">
		        <Option v-for="item in list" :value="item.id" :key="item.id">{{ item.name }}</Option>
		    </Select>
	        <Input style="width:280px" v-model="addContent" placeholder="请输入您要添加的内容"></Input>
        </div>
        <div class="flex" v-if="mode == 'class'">
        	<Row>
        		<Col span="12"><Cascader :data="listData" v-model="addClassInfo"></Cascader></Col>
        		<Col span="12"><Input v-model="addContent" placeholder="请输入您要添加的内容"></Input></Col>
        	</Row>
        </div>
        <div v-if="mode == 'collage'">
        	<Input v-model="addContent" placeholder="请输入您要添加的内容"></Input>
        </div>
        <div slot="footer">
        	<Button @click="showModal = false">取消</Button>
        	<Button :loading="loading" type="primary" @click="handleAddEvent">添加</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
export default {
	data() {
		return {
			color: ['blue', 'green', 'red', 'yellow'],
			list: [],
			listData: [],
			showModal: false,
			addContent: '',
			mode: '',
			loading: false,
			collageId: null,
			addClassInfo: [],
		}
	},
	watch: {
		'list': 'initData',
	},
	computed: {
		modalTitle() {
			if (this.mode === 'collage') {
				return '添加学院';
			} else if (this.mode === 'class') {
				return '添加班级';
			} else if (this.mode === 'speciality') {
				return '添加专业';
			}
			return '';
		},
	},
	mounted() {
		this.getDataList();
	},
	methods:{
		initData() {
			this.listData = [];
			this.list.forEach(item => {
				const li = {
					value: item.id,
                    label: item.name,
                    children: [],
				};
				item.speciality.forEach((item2,index) => {
					li.children.push({
						value: index,
						label: item2.name,
					});
				});
				this.listData.push(li);
			});
		},
		delectClass(id, index, name) {
			const self = this;
			this.$Modal.confirm({
                title: '提示',
                content: '确定要删除该班级吗',
                loading: true,
                onOk: () => {
                	self.$http({
                		method: 'get',
                		url: '/api/delete_class',
                		params:{
                			id,
                			speciality_index: index,
                			class_name: name,
                		},
                	}).then((res) => {
                		this.$Modal.remove();
                		if (res.data.status === 0) {
                			this.$Message.success('删除成功');
                			self.getDataList();
                		}
                	});
                }
            });
		},
		delectSpeciality(id, name) {
			const self = this;
			this.$Modal.confirm({
                title: '提示',
                content: '删除后该专业下的班级都会清除',
                loading: true,
                onOk: () => {
                	self.$http({
                		method: 'get',
                		url: '/api/delete_speciality',
                		params:{
                			id,
                			speciality_name: name,
                		},
                	}).then((res) => {
                		this.$Modal.remove();
                		if (res.data.status === 0) {
                			this.$Message.success('删除成功');
                			self.getDataList();
                		}
                	});
                }
            });
		},
		delectCollage(e) {
			const self = this;
			this.$Modal.confirm({
                title: '提示',
                content: '删除后该学院下的专业都会清除',
                loading: true,
                onOk: () => {
                	self.$http({
                		method: 'get',
                		url: '/api/remove_collage',
                		params:{
                			id: e,
                		},
                	}).then((res) => {
                		this.$Modal.remove();
                		if (res.data.status === 0) {
                			this.$Message.success('删除成功');
                			self.getDataList();
                		}
                	});
                }
            });
		},
		handleAddEvent() {
			if (!this.addContent) {
				this.$Message.info('您还没有填写内容');
				return;
			}
			this.loading = true;
			if (this.mode === 'collage') {
				this.addCollage();
			} else if (this.mode === 'speciality' && this.collageId) {
				this.addSpeciality();
			} else if (this.mode === 'class' && this.addClassInfo.length > 0) {
				this.addClass();
			} else {
				this.$Message.info('您还没有内容没选择');
				this.loading = false;
			}
		},
		addClass() {
			this.$http({
				method: 'get',
				url: '/api/add_class',
				params: {
					id: this.addClassInfo[0],
					speciality_index: this.addClassInfo[1],
					class_name: this.addContent,
				},
			}).then((res) => {
				this.loading = false;
				this.showModal = false;
				this.getDataList();
				if (res.data.status === 0) {
					this.$Message.success('添加成功');
				}
			});
		},
		addSpeciality() {
			this.$http({
				method: 'get',
				url: '/api/add_speciality',
				params: {
					id: this.collageId,
					speciality_name: this.addContent,
				},
			}).then((res) => {
				this.loading = false;
				this.showModal = false;
				this.getDataList();
				if (res.data.status === 0) {
					this.$Message.success('添加成功');
				}
			});
		},
		addCollage() {
			this.$http({
				method: 'get',
				url: '/api/add_collage',
				params: {
					collage_name: this.addContent,
				},
			}).then((res) => {
				this.loading = false;
				this.showModal = false;
				this.getDataList();
				if (res.data.status === 0) {
					this.$Message.success('添加成功');
				}
			});
		},
		handleAdd(e) {
			this.addContent = '';
			this.mode = e;
			this.showModal = true;
		},
		getDataList() {
			this.$http({
				method: 'get',
				url: '/api/other',
			}).then((res) => {
				this.list = res.data.data.list;
			});
		},
	}
}
</script>

<style>
.other .title{
	font-size: 22px;
	font-weight: bold;
	color: #464c5b;
	cursor: auto;
	margin-right: 10px;
}
.other .block{
	background: #f8f8f8;
	border-radius: 5px;
	padding: 20px;
}
.other .flex{
	display: flex;
	align-items: center;
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
}
.vertical-center-modal .ivu-modal{
	top: 0;
}
</style>
