<template>
    <div class="subject">
        <Row :gutter="20">
            <c-ol span="4">
                <Select v-model="subjectId">
                    <Option v-for="item in subjectList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </c-ol>
            <c-ol span="8">
                <Select v-model="userId" multiple filterable>
                <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </c-ol>
            <c-ol span="2">
                <Button type="info" @click="handAdd">添加</Button>
            </c-ol>
        </Row>
        <Row v-for="item in subjectList" :key="item.id">
            <c-ol span="24">
                <div class="flex">
                <p class="title">{{item.name}}</p>
                </div>
            </c-ol>
            <c-ol span="24" class="block">
                <template v-if="checkList(item.id, item2.subject_list)">
                    <Tag
                    type="dot"
                    closable
                    :c-olor="color[index % 4]"
                    v-for="(item2, index) in userList"
                    :key="item2.id"
                    >{{item2.name}}</Tag>
                </template>
            </c-ol>
        </Row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            color: ["blue", "green", "red", "yellow"],
            subjectList: [],
            userList: [],
            userId: [],
            subjectId: null
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getSubjectList();
        this.getTeacherList();
    },
    methods: {
        checkList(id, list) {
            if (list === undefined) return false;
            if (list.indexOf(id) !== -1) {
                return true;
            }
            return false;
        },
        handAdd() {
            if (!this.subjectId || this.userId.length === 0) {
                this.$Message.error("内容不能为空");
                return;
            }
            this.$http({
                method: "get",
                url: "/api/match_subject",
                params: {
                subject_id: this.subjectId,
                user: this.userId
                }
            }).then(res => {
                if (res.data.status === 0) {
                this.$Message.success("添加成功");
                }
                this.getSubjectList();
                this.getTeacherList();
            });
        },
        getSubjectList() {
            this.$http({
                method: "get",
                url: "/api/check_subject"
            }).then(res => {
                this.subjectList = res.data.data.subject_list;
            });
        },
        getTeacherList() {
            this.$http({
                method: "get",
                url: "/api/get_teacher"
            }).then(res => {
                this.userList = res.data.data.teacher_list;
            });
        }
    }
};
</script>

<style>
.subject .title {
    font-size: 22px;
    font-weight: bold;
    color: #464c5b;
    cursor: auto;
    margin-right: 10px;
}
.subject .block {
    background: #f8f8f8;
    border-radius: 5px;
    padding: 20px;
}
.subject .flex {
    display: flex;
    align-items: center;
}
</style>
