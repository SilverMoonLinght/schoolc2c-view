<template>
  <div class="mainBox">
    <el-card>
      <el-form
        :model="updatePassData"
        label-width="80px"
        ref="updatePassDataRef"
        :rules="rules"
      >
        <el-form-item label="旧密码" prop="oldPass">
          <el-input v-model="updatePassData.oldPass" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input v-model="updatePassData.newPass" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="verifyPass">
          <el-input
            v-model="updatePassData.verifyPass"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="confirm"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.updatePassData.verifyPass !== "") {
          this.$refs.updatePassDataRef.validateField("verifyPass");
        }
        if (!(value.length > 5 && value.length < 20)) {
          callback(new Error("密码长度应为5~20字符"));
        } else {
          callback();
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.updatePassData.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      updatePassData: {
        oldPass: "",
        newPass: "",
        verifyPass: ""
      },
      rules: {
        oldPass: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newPass: [{ required: true, validator: validatePass, trigger: "blur" }],
        verifyPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  methods: {
    confirm() {
      this.$refs.updatePassDataRef.validate(async valid => {
        if (!valid) return;
        const confirmResult = await this.$confirm("是否确认修改密码?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).catch(err => err);

        if (confirmResult != "confirm") {
          return this.$Message.info("已取消删除");
        }

        const { data: res } = await this.$http.get(
          "http://127.0.0.1:8082/updatePass",
          {
            params: this.updatePassData
          }
        );
        if (res === "success") {
          this.$Message.success("修改成功！");
          localStorage.removeItem("token");
          return this.$router.push("/userLogin");
        }
        if (res === "fail") {
          return this.$Message.error("旧密码错误!");
        } else {
          return this.$Message.error("修改失败!");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.mainBox {
  width: 30%;
  margin: 30px auto;
}
</style>