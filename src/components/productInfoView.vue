<template>
  <div>
    <el-card class="productInfoCard">
      <el-row :gutter="20">
        <el-col :offset="2" :span="10">
          <el-image
            style="width: 300px; height: 300px"
            :fit="fit"
            :src="imgUrl"
            @click="dialogVisible = true"
          >
          </el-image>
          <el-dialog title="预览大图" :visible.sync="dialogVisible" width="30%">
            <span>
              <el-image :src="imgUrl" fit="contain"></el-image>
            </span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">
                确 定
              </el-button>
            </span>
          </el-dialog>
        </el-col>
        <el-col :span="10">
          <p class="pName">{{ productInfo.skuName }}</p>
          <p style="font-size:14px;color:#616776">
            {{ productInfo.skuDesc }}
          </p>
          <div class="info-item">
            <i class="el-icon-coin i-title"></i>
            <span>{{ productInfo.price }}</span>
          </div>
          <div>
            <div style="float:left;height:100px">
              <i class="el-icon-chat-line-round i-title"></i>
            </div>
            <div>
              <p v-if="productInfo.phone != null">
                手机：{{ productInfo.phone }}
              </p>
              <p v-if="productInfo.wechat != null">
                微信：{{ productInfo.wechat }}
              </p>
              <p v-if="productInfo.qq != null">QQ：{{ productInfo.qq }}</p>
              <p>学校：{{ productInfo.school }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="text-area">
        <h3>留言：</h3>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="message.text"
          maxlength="150"
          show-word-limit
        ></el-input>
        <el-button class="mesaageBtn" type="primary" @click="textCommit"
          >发表</el-button
        >
      </div>
      <div class="comment">
        <div class="comment-item" v-for="item in comment" :key="item.id">
          <div class="comment-item-left">
            <el-avatar :src="item.icon"></el-avatar>
            <div class="user">
              <div>{{ item.nickname }}</div>
              <div style="color:#808695;font-size:10px;margin-top:10px">
                {{ item.datetime }}
              </div>
            </div>
          </div>
          <div class="comment-item-right">
            <p>{{ item.text }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      fit: "contain",
      imgUrl: "",
      productInfo: {},
      message: {
        pid: "",
        text: "",
        date: ""
      },
      comment: [],
      user: {},
      queryInfo: { id: "" },
      token: "",
      dialogVisible: false
    };
  },
  created() {
    this.getToken();
    this.getProductInfo();
    this.getMessage();
    this.getUserByToken();
  },
  methods: {
    getToken() {
      this.token = localStorage.getItem("token");
    },
    async getProductInfo() {
      this.queryInfo.id = this.$route.query.id;
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getProductInfo",
        {
          params: this.queryInfo
        }
      );
      this.productInfo = res;
      this.imgUrl = this.productInfo.imgUrl;
    },
    async textCommit() {
      if (this.token === null) {
        this.$Message.success("请登录后留言");
        return this.$router.push(
          "/userLogin?rUrl=" + this.$route.path + "?id=" + this.queryInfo.id
        );
      }
      this.message.pid = this.queryInfo.id;
      const { data: res } = await this.$http.post(
        "http://127.0.0.1:8084/releaseMessage",
        this.message
      );
      if (res === "success") {
        this.reload();
        return this.$Message.success("发送成功!");
      } else {
        return this.$Message.error("发送失败!");
      }
    },
    async getMessage() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getMessageByPid",
        {
          params: this.queryInfo
        }
      );
      this.comment = res;
    },
    async getUserByToken() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8082/getUserByToken"
      );
      this.user = res;
    }
  }
};
</script>

<style lang="less" scoped>
.productInfoCard {
  width: 70%;
  position: relative;
  left: 15%;
}
.pName {
  font-size: 18px;
}
.i-title {
  margin-right: 10px;
}
.info-item {
  margin-bottom: 10px;
}
.text-area {
  width: 65%;
  position: relative;
  left: 9%;
}
.mesaageBtn {
  margin-top: 10px;
  position: relative;
  left: 89%;
}
.comment {
  border-top: 1px solid rgb(112, 109, 109);
  margin-top: 10px;
  width: 65%;
  position: relative;
  left: 9%;
}
.comment-item {
  padding: 10px;
  border-bottom: 1px solid rgb(192, 190, 190);
  display: flex;
}
.comment-item-left {
  display: flex;
}
.user {
  margin-left: 8px;
}
.comment-item-right {
  margin-left: 10px;
  color: #616776;
}
</style>