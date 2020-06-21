<template>
  <div class="userRegisterBox">
    <el-card>
      <span>用户注册</span>
      <el-form
        class="userRegisterForm"
        :model="userRegisterData"
        :rules="rules"
        ref="userRegisterFormRef"
        label-width="78px"
      >
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="userRegisterData.username"
            type="text"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="nickname" label="昵称">
          <el-input
            v-model="userRegisterData.nickname"
            type="text"
            placeholder="请输入昵称"
            clearable
          >
          </el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="userRegisterData.password"
            type="password"
            placeholder="请输入密码"
            clearable
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="verifypass" label="确认密码">
          <el-input
            v-model="userRegisterData.verifypass"
            type="password"
            placeholder="请再一次输入密码"
            clearable
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input
            v-model.number="userRegisterData.phone"
            type="text"
            placeholder="请输入手机号"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="school" label="学校">
          <el-input
            v-model.number="userRegisterData.school"
            type="text"
            placeholder="请输入学校名"
            clearable
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="userRegisterBtn">
          确认注册
        </el-button>
        <el-button @click="returnLogin">返回登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.userRegisterData.verifypass !== "") {
          this.$refs.userRegisterFormRef.validateField("verifypass");
        }
        if (!(value.length > 4 && value.length < 21)) {
          callback(new Error("密码长度应为5~20字符"));
        } else {
          callback();
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userRegisterData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      const regMobile = /^1(3|4|5|7|8)\d{9}$/;
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!regMobile.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {
      userRegisterData: {
        username: "",
        nickname: "",
        password: "",
        phone: "",
        verifypass: "",
        school: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 16, message: "用户名长度为6~16字符", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 6, max: 20, message: "昵称长度为6~18字符", trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        verifypass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        school: [{ required: true, message: "请输入学校名", trigger: "blur" }]
      }
    };
  },
  created() {},
  methods: {
    userRegisterBtn() {
      this.$refs.userRegisterFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "http://127.0.0.1:8082/userRegister",
          this.userRegisterData
        );
        if (res === "fail") {
          this.$Message.error("注册失败");
        }
        if (res === "success") {
          this.$router.push("/userLogin");
        }
      });
    },
    returnLogin() {
      this.$router.push("/userLogin");
    }
  }
};
</script>

<style lang="less" scoped>
.userRegisterBox {
  width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.userRegisterForm {
  margin-top: 10px;
}
</style>