<template>
  <div>
    <Modal :value="show" width="600" @on-visible-change="change">
      <div style="margin-top: 20px;">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="学生姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="姓名" />
          </FormItem>
          <FormItem label="学生学号" prop="id">
            <Input v-model="formValidate.id" :disabled="mode != 0" placeholder="学号" />
          </FormItem>
          <FormItem label="性别" prop="sex">
            <Select v-model="formValidate.sex">
              <Option value="0">男</Option>
              <Option value="1">女</Option>
              <Option value="2">未知</Option>
            </Select>
          </FormItem>
          <FormItem label="班级信息">
            <Cascader :data="collageData" v-model="collageArr"></Cascader>
          </FormItem>
          <FormItem label="成绩">
            <div v-if="!addGrade">
              <Tag
                v-for="(item, index) in formValidate.tagList"
                :key="item"
                @on-close="delTag(index)"
                :name="item"
                closable
                :color="color[index % 4]"
              >{{item}}</Tag>
              <Button icon="ios-plus-empty" type="dashed" size="small" @click="addGrade = true">添加成绩</Button>
            </div>
            <div v-else style="display: flex;">
              <i-nput v-model="subject" style="width: 150px; margin-right: 5px;">
                <span slot="prepend">科目</span>
              </i-nput>
              <i-nput v-model="grade" style="width: 100px;margin-right: 5px;">
                <span slot="prepend">分数</span>
              </i-nput>
              <Button style="margin-right: 5px;" size="small" @click="addGrade = false">取消</Button>
              <Button size="small" type="info" @click="addTag">确定</Button>
            </div>
          </FormItem>
          <FormItem>
            <Button v-if="mode === 0" type="primary" @click="handleSubmit('formValidate')">确定</Button>
            <Button v-else type="primary" @click="updateStudent('formValidate')">修改</Button>
            <Button
              v-if="mode === 0"
              type="ghost"
              @click="handleReset('formValidate')"
              style="margin-left: 8px"
            >重置</Button>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <!-- <Button size="large" @click="change(false)">取消</Button> -->
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: ["show", "mode", "formValidate"],
  computed: {},
  data() {
    return {
      subject: "",
      grade: "",
      addGrade: false,
      color: ["blue", "green", "red", "yellow"],
      collageData: [],
      collageArr: [],
      ruleValidate: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        id: [{ required: true, message: "学号不能为空", trigger: "blur" }],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        collageArr: [
          { required: true, message: "班级信息不能为空", trigger: "blur" }
        ],
        major: [{ required: true, message: "专业不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    collageArr(val) {
      if (val[0]) {
        this.formValidate.collage = val[0];
      } else {
        this.formValidate.collage = "";
      }
      if (val[2]) {
        this.formValidate.major = val[2];
      } else {
        this.formValidate.major = "";
      }
    }
  },
  mounted() {
    this.getCollageList();
  },
  methods: {
    initData(list) {
      this.collageData = [];
      list.forEach(item => {
        const li = {
          value: item.name,
          label: item.name,
          children: []
        };
        if (item.speciality) {
          item.speciality.forEach((item2, index) => {
            li.children.push({
              value: item2.name,
              label: item2.name,
              children: []
            });
            if (item2.class) {
              item2.class.forEach(item3 => {
                li.children[index].children.push({
                  value: item3,
                  label: item3
                });
              });
            }
          });
        }
        this.collageData.push(li);
      });
    },
    getCollageList() {
      this.$http({
        method: "get",
        url: "/api/other"
      }).then(res => {
        this.initData(res.data.data.list);
      });
    },
    handleSpinCustom() {
      this.$Spin.show({
        render: h => {
          return h("div", [
            h("Icon", {
              class: "demo-spin-icon-load",
              props: {
                type: "load-c",
                size: 18
              }
            }),
            h("div", "Loading")
          ]);
        }
      });
    },
    change(e) {
      if (e === false) {
        this.$emit("closeForm");
      }
    },
    handleSubmit(name) {
      if (this.formValidate.collage === "" || this.formValidate.major === "") {
        this.$Message.error("班级信息不完整");
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.handleSpinCustom();
          this.$emit("closeForm");
          this.$http({
            method: "post",
            url: "/api/add_student",
            data: {
              std_form: this.formValidate
            }
          }).then(res => {
            if (res.data.status === 0) {
              this.$emit("add_success");
              this.$Message.success("添加成功");
            }
          });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    updateStudent(name) {
      if (this.formValidate.collage === "" || this.formValidate.major === "") {
        this.$Message.error("班级信息不完整");
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.handleSpinCustom();
          this.$emit("closeForm");
          this.$http({
            method: "post",
            url: "/api/modifly_student",
            data: {
              std_form: this.formValidate
            }
          }).then(res => {
            if (res.data.status === 0) {
              this.$emit("add_success");
              this.$Message.success("修改成功");
            }
          });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.formValidate.tagList = [];
    },
    addTag() {
      if (this.subject === "" || this.grade === "") {
        this.addGrade = false;
        return;
      }
      if (~~this.grade > 100 || ~~this.grade < 0) {
        this.$Message.error("请输入正确的分数");
        return;
      }
      const str = `${this.subject}:${this.grade}`;
      this.formValidate.tagList.push(str);
      this.addGrade = false;
      this.subject = "";
      this.grade = "";
    },
    delTag(index) {
      this.formValidate.tagList.splice(index, 1);
    }
  }
};
</script>
<style>
.form {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  z-index: 999;
  transition: all 1s;
}
.show {
  background: rgba(0, 0, 0, 0.5);
}
</style>