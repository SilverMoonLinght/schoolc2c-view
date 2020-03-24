<template>
  <div class="userLoginBox">
    <el-card class="box-card">
      <span>用户登录</span>
      <el-form
        class="userLoginForm"
        :model="userLoginData"
        :rules="rules"
        ref="userLoginFormRef"
      >
        <!-- adminname -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="userLoginData.username"
            type="text"
            placeholder="用户名"
            clearable
          ></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="userLoginData.password"
            type="password"
            placeholder="密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="userLoginBtn">登录</el-button>
          <el-button type="info" @click="toRegisterBtn">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userLoginData: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    userLoginBtn() {
      console.log(this.userLoginData);
      this.$refs.userLoginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "http://127.0.0.1:8082/userLogin",
          this.userLoginData
        );
        if (res) {
          this.$router.push("/home");
        }
      });
    },
    toRegisterBtn() {}
  }
};
</script>

<style lang="less" scoped>
.userLoginBox {
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.userLoginForm {
  margin-top: 10px;
}
</style>