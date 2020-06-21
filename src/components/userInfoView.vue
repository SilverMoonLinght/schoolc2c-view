<template>
  <div class="userInfoBox">
    <el-card>
      <el-form label-width="80px" ref="" :model="userInfo">
        <el-form-item label="昵称">
          <el-input v-model="userInfo.nickname" prop="nickname"></el-input>
        </el-form-item>
        <el-form-item label="个性签名" prop="personalizedSignature">
          <el-input
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
            v-model="userInfo.personalizedSignature"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="userInfo.gender">
            <el-radio :label="'0'">保密</el-radio>
            <el-radio :label="'1'">男</el-radio>
            <el-radio :label="'2'">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="学校" prop="school">
          <el-input v-model="userInfo.school"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="icon">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:8084/imgUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" class="btn">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      userInfo: {},
      imageUrl: ""
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      if (localStorage.getItem("token") !== null) {
        const { data: res } = await this.$http.get(
          "http://127.0.0.1:8082/getUserByToken"
        );
        if (res) {
          this.imageUrl = res.icon;
          this.userInfo = res;
        }
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res;
      this.userInfo.icon = res;
    },
    async submit() {
      const { data: res } = await this.$http.post(
        "http://127.0.0.1:8082/editUserInfo",
        this.userInfo
      );
      if (res === "success") {
        this.$Message.success("修改成功!");
      } else {
        this.$Message.error("修改失败!");
        this.getUserInfo();
        this.reload();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.userInfoBox {
  width: 30%;
  margin: 30px auto;
}
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: contain;
}
.btn {
  position: relative;
  left: 22%;
  width: 30%;
}
</style>