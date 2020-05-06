<template>
  <div class="adminLogin_container">
    <div class="adminLogin_box">
      <el-form
        class="adminLoginForm"
        :model="adminLoginData"
        :rules="rules"
        ref="adminLoginFormRef"
      >
        <!-- adminname -->
        <el-form-item prop="adminname">
          <el-input
            prefix-icon="el-icon-user"
            v-model="adminLoginData.adminname"
            type="text"
            placeholder="管理员账户"
          ></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="adminLoginData.password"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="adminLoginBtn">登录</el-button>
          <el-button type="info" @click="resetAdminLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      adminLoginData: {
        adminname: "",
        password: ""
      },
      rules: {
        adminname: [
          { required: true, message: "请输入管理员账户!", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码!", trigger: "blur" }]
      }
    };
  },
  methods: {
    resetAdminLoginForm() {
      this.$refs.adminLoginFormRef.resetFields();
    },
    adminLoginBtn() {
      this.$refs.adminLoginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/adminLogin",
          this.adminLoginData
        );
        if (res) {
          this.$Message.success("登陆成功!");
          this.$router.push("/welcome");
        } else return this.$Message.error("登录失败!");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.adminLogin_container {
  height: 100%;
  background-color: #2b4b6b;
}
.adminLogin_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.adminLoginForm {
  position: absolute;
  top: 18%;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
}
.btns {
  position: absolute;
  left: 30%;
}
</style>