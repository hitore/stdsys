<template>
	<div>
		<div class="search-box">
			<Input style="width: 200px;" v-model="checkInfo.id">
		        <span slot="prepend">学号</span>
		    </Input>
		    <Input style="width: 200px;margin-left: 20px;" v-model="checkInfo.name">
		        <span slot="prepend">姓名</span>
		    </Input>
		    <Button style="margin-left: 20px;" type="info" @click="check">查询</Button>
		    <Button @click="addStudent" style="margin-left: auto;" type="info">添加学生</Button>
            <Upload
                style="height: 40px;"
                :before-upload="handleUpload"
                action="//jsonplaceholder.typicode.com/posts/">
                <Button style="height: 40px; margin-left: 20px;" type="info">批量导入</Button>
            </Upload>
		</div>
		<Table border :columns="columns7" :data="data6"></Table>
		<div class="fenye-box">
			<Page class-name="fenye" @on-change="changePage" :total="pageCount" show-elevator></Page>
		</div>
		<add-student :show="showForm" :formValidate="formValidate" :mode="mode" @add_success="addSuccess" @closeForm="closeForm"></add-student>
        <Modal
            title="删除学生"
            v-model="delInfo.show"
            :loading="delInfo.loading"
            @on-ok="deleteStudent"
            class-name="vertical-center-modal">
            <p>您确定要删除学生“{{delInfo.stdName}}”吗？</p>
        </Modal>
        <Modal
            v-model="xlsx.show"
            title="批量添加"
            width="1000"
            @on-ok=""
            @on-cancel="">
            <Table :columns="xlsx.columns" height="500" :data="xlsx.data"></Table>
            <div slot="footer">
                <Button @click="xlsx.show = false">cancle</Button>
                <Button type="info" :loading="xlsx.loading" @click="addMoreStudent">add</Button>
            </div>
        </Modal>
	</div>
</template>
<script>
	import addStudent from '@/components/form/addStudent.vue';
	export default {
		components: {
			addStudent,
		},
        data () {
            return {
                xlsx: {
                    show: false,
                    columns: [],
                    data: [],
                    loading: false,
                },
                file: null,
                checkInfo: {
                    id: '',
                    name: '',
                },
                delInfo: {
                    show: false,
                    id: '',
                    stdName: '',
                    loading: true,
                },
            	sexArr: ['男', '女', '未知'],
            	mode: 0,
            	formValidate: {
                    name: '',
                    id: '',
                    sex: '',
                    collage: '',
                    major: '',
                    tagList: [],
                },
            	showForm: false,
                columns7: [
                    {
                        title: '学号',
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
                        }
                    },
                    {
                    	title: '班级',
                    	key: 'major',
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
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index);
                                        }
                                    }
                                }, '查看成绩')
                            ]);
                        }
                    }
                ],
                data6: [],
                page: 1,
                pageCount: 10,
                KEY_TYPE: {
                    '学号': 'id',
                    '姓名': 'name',
                    '性别': 'sex',
                    '班级': 'major',
                    '学院': 'collage',
                },
            }
        },
        mounted() {
        	this.getStudentList();
        },
        methods: {
            handleUpload(file) {
                const self = this;
                var reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onload = function(e) {
                    var data = e.target.result;
                    const wb = self.$xlsx.read(data, { type: 'binary' });
                    const da = self.$xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});
                    self.xlsx.show = true;
                    const columns = [];
                    da[0].forEach((item, index) => {
                        if (index === 0) {
                            columns.push({
                                title: item,
                                key: self.KEY_TYPE[item] || item,
                                width: 200,
                                fixed: 'left',
                            });
                        } else {
                            columns.push({
                                title: item,
                                key: self.KEY_TYPE[item] || item,
                                width: 200,
                            });
                        }
                    });
                    self.xlsx.columns = columns;
                    da.shift(1);
                    const tableData = [];
                    da.forEach(item => {
                        const q = {
                            tagList: [],
                        };
                        item.forEach((item2, index) => {
                            q[columns[index].key] = item2;
                            if (parseInt(item2, 10) > 0 && parseInt(item2, 10) <= 100) {
                                q.tagList.push(`${columns[index].key}：${item2}`);
                            }
                        });
                        tableData.push(q);
                    });
                    self.xlsx.data = tableData;
                    self.tableData = tableData;
                }
                return false;
            },
            addMoreStudent() {
                this.xlsx.loading = true;
                this.$http({
                    method: 'post',
                    url: '/api/add_more_student',
                    data: {
                      std_form: this.tableData,
                    },
                }).then(res => {
                    if (res.data.status === 0) {
                        this.$Message.success('添加成功');
                    }
                    this.xlsx.loading = false;
                    this.xlsx.show = false;
                    this.getStudentList();
                });
            },
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
            check() {
                const { checkInfo } = this;
                if (checkInfo.id === '' && checkInfo.name === '') {
                    this.page = 1;
                    this.getStudentList();
                } else {
                    this.handleSpinCustom();
                    this.page = 1;
                    this.$http({
                        method: 'get',
                        url: '/api/search_student',
                        params: {
                            page: this.page,
                            id: this.checkInfo.id,
                            name: this.checkInfo.name,
                            // count: 2,
                        },
                    }).then((res) => {
                        this.$Spin.hide();
                        this.data6 = res.data.data.std_list;
                        this.pageCount = res.data.data.page_count * 10;
                    });
                }
            },
            addSuccess() {
            	this.closeForm();
            	this.page = 1;
            	this.getStudentList();
            },
            changePage(e) {
            	this.page = e;
            	this.getStudentList();
            },
        	getStudentList() {
        		this.handleSpinCustom();
        		this.$http({
					method: 'get',
				    url: '/api/check_student',
				    params: {
				    	page: this.page,
				    	// count: 2,
				    },
				}).then((res) => {
					this.$Spin.hide();
                    if (res.data.status === 0) {
                        const data = res.data.data;
                        this.pageCount = data.page_count * 10;
                        this.data6 = data.std_list;
                    }
				});
        	},
        	modifly(row) {
        		this.formValidate = JSON.parse(JSON.stringify(this.data6[row._index]));
            	this.mode = 1;
        		this.showForm = true;
        	},
            show (index) {
                const data = this.data6[index];
                let content = '';
                content = content + `姓名：${data.name}<br>`;
                content = content + `学号：${data.id}<br>`;
                content = content + `性别：${this.sexArr[data.sex]}<br>`;
                content = content + `班级：${data.major}<br>`;
                content = content + `学院：${data.collage}<br>`;
                if (data.tagList.length > 0) {
                    content = content + '成绩：';
                    data.tagList.forEach(item => {
                        content = content + item + '\t';
                    });
                }
                this.$Modal.info({
                    title: '学生成绩',
                    content,
                })
            },
            remove (index) {
                this.delInfo.show = true;
                this.delInfo.stdName = this.data6[index].name;
                this.delInfo.id = this.data6[index].id;
            },
            deleteStudent() {
                this.$http({
                    method: 'get',
                    url: '/api/delete_student',
                    params: {
                        id: this.delInfo.id,
                    },
                }).then((res) => {
                    this.delInfo.show = false;
                    if (res.data.status === 0) {
                        this.$Message.success('删除成功');
                        if (this.page > res.data.data.page_count) {
                            this.page -= 1;
                        }
                        this.getStudentList();
                    }
                });
            },
            addStudent() {
            	this.formValidate = {
            		name: '',
                    id: '',
                    college: '',
                    major: '',
                    tagList: [],
            	};
            	this.mode = 0;
            	this.showForm = true;
            },
            closeForm() {
            	this.showForm = false;
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
    .ivu-upload-select{
        height: 40px !important;
    }
</style>