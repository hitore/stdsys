<template>
	<div>
		<div class="search-box">
			<Input style="width: 200px;" v-model="checkInfo.id">
		        <span slot="prepend">职工号</span>
		    </Input>
		    <Input style="width: 200px;margin-left: 20px;" v-model="checkInfo.name">
		        <span slot="prepend">姓名</span>
		    </Input>
		    <Button style="margin-left: 20px;" type="info" @click="">查询</Button>
		    <Button @click="addTeacher" style="margin-left: auto;" type="info">添加教师</Button>
		</div>
		<Table :loading="loading" border :columns="columns7" :data="data6"></Table>
		<div class="fenye-box">
			<Page class-name="fenye" @on-change="handlePage" :total="pageInfo.total" show-elevator></Page>
		</div>
        <Modal
            title="删除学生"
            v-model="delInfo.show"
            :loading="delInfo.loading"
            @on-ok=""
            class-name="vertical-center-modal">
            <p>您确定要删除学生“{{delInfo.stdName}}”吗？</p>
        </Modal>
        <add-teacher
            :show-add-teacher.sync="showAddTeacher"
            :form="form"
            :mode="mode"
            @success="getTeacherList"></add-teacher>
	</div>
</template>
<script>
    import addTeacher from '@/components/form/addTeacher';
	export default {
		components: {
            addTeacher,
		},
        data () {
            return {
                loading: true,
                delInfo: {
                    show: false,
                    loading: false,
                    stdName: '',
                },
                checkInfo: {
                    id: '',
                    name: '',
                },
            	sexArr: ['男', '女', '未知'],
                positionArr: ['教师', '教授'],
            	mode: 0,
                showAddTeacher: false,
                form: {
                    name: '',
                    id: '',
                    sex: '',
                    position: '',
                    collage: '',
                },
                columns7: [
                    {
                        title: '职工号',
                        key: 'id',
                        fixed: 'left',
                        width: 150,
                    },
                    {
                        title: '姓名',
                        key: 'name',
                    },
                    {
                        title: '性别',
                        key: 'sex',
                        render: (h, params) => {
                            return h('div', {}, this.sexArr[params.row.sex]);
                        },
                    },
                    {
                    	title: '职位',
                    	key: 'position',
                        render: (h, params) => {
                            return h('div', {}, this.positionArr[params.row.position]);
                        },
                    },
                    {
                    	title: '学院',
                    	key: 'collage',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modifly(params.row);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index);
                                        }
                                    }
                                }, '删除'),
                            ]);
                        }
                    }
                ],
                data6: [],
                pageInfo: {
                    page: 1,
                    total: 7,
                    count: 7,
                },
            }
        },
        mounted() {
            this.getTeacherList();
        },
        methods: {
            handlePage(e) {
                this.pageInfo.page = e;
                this.getTeacherList();
            },
            getTeacherList() {
                this.loading = true;
                this.$http({
                    method: 'get',
                    url: '/api/check_teacher',
                    params: {
                        page: this.pageInfo.page,
                        count: this.pageInfo.count,
                    },
                }).then((res) => {
                    if (res.data.status === 0) {
                        const data = res.data.data;
                        this.pageInfo.total = data.total * 2;
                        this.data6 = data.tea_list;
                        this.loading = false;
                    }
                });
            },
            modifly(rowData) {
                this.form = rowData;
                this.mode = 1;
                this.showAddTeacher = true;
            },
        	addTeacher() {
                this.form = {
                    name: '',
                    id: '',
                    sex: '',
                    position: '',
                    collage: '',
                };
                this.mode = 0;
                this.showAddTeacher = true;
            },
        }
    }
</script>
<style>
	.search-box{
		margin-bottom: 16px;
		display: flex;
	}
	.fenye-box{
		display: flex;
		margin-top: 20px;
	}
	.fenye{
		margin: 0 auto;
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