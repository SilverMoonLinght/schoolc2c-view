<template>
  <div class="box">
    <el-card>
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
          <p class="pName">{{ auctionInfo.skuName }}</p>
          <p style="font-size:14px;color:#616776">
            {{ auctionInfo.skuDesc }}
          </p>
          <div class="info-item">
            <i class="el-icon-coin i-title"></i>
            <span>起拍价:￥{{ auctionInfo.price }}</span>
          </div>
          <div>
            <div style="float:left;height:100px">
              <i class="el-icon-chat-line-round i-title"></i>
            </div>
            <div>
              <p v-if="auctionInfo.phone != null">
                手机：{{ auctionInfo.phone }}
              </p>
              <p v-if="auctionInfo.wechat != null">
                微信：{{ auctionInfo.wechat }}
              </p>
              <p v-if="auctionInfo.qq != null">QQ：{{ auctionInfo.qq }}</p>
              <p>学校：{{ auctionInfo.school }}</p>
            </div>
          </div>
          <div>
            <p>开始时间:{{ auctionInfo.startdate }}</p>
            <p>结束时间:{{ auctionInfo.enddate }}</p>
          </div>
          <div>
            输入价格:
            <el-input
              v-model="auctionRecord.price"
              style="width:200px"
            ></el-input>
            <el-button type="primary" @click="submit" style="margin-left:10px"
              >提交价格</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="auction-record">
      <div>当前价格：￥{{ maxPrice }}</div>
      <div class="auction-record-item">
        拍卖记录：<el-table :data="tableData" style="width: 40%" border>
          <el-table-column prop="nickname" label="昵称" width="150">
          </el-table-column>
          <el-table-column prop="price" label="价格" width="80">
          </el-table-column>
          <el-table-column prop="datetime" label="时间"> </el-table-column>
        </el-table>
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
      auctionInfo: {},
      user: {},
      queryInfo: { id: "" },
      token: "",
      dialogVisible: false,
      auctionRecord: { aid: "", price: "" },
      tableData: [],
      maxPrice: ""
    };
  },
  created() {
    this.getToken();
    this.getAuctionInfo();
    this.getAuctionRecord();
    this.getMaxPrice();
  },
  methods: {
    getToken() {
      this.token = localStorage.getItem("token");
    },
    async getAuctionInfo() {
      this.queryInfo.id = this.$route.query.id;
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getAuctionInfo",
        {
          params: this.queryInfo
        }
      );
      this.auctionInfo = res;
      this.imgUrl = this.auctionInfo.imgUrl;
    },
    async submit() {
      if (this.token === null) {
        this.$Message.success("请登录后提交!");
        return this.$router.push(
          "/userLogin?rUrl=" + this.$route.path + "?id=" + this.queryInfo.id
        );
      }
      this.auctionRecord.aid = this.$route.query.id;
      const { data: res, status: status } = await this.$http
        .post("http://127.0.0.1:8084/submitAuctionPrice", this.auctionRecord)
        .catch(error => {
          if (error) {
            return this.$Message.error("提交失败!");
          }
        });
      if (status === 200 && res === "success") {
        this.$Message.success("提交成功!");
      }
      this.reload();
    },
    async getAuctionRecord() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getAuctionRecord",
        {
          params: { aid: this.$route.query.id }
        }
      );
      console.log(res);
      this.tableData = res;
    },
    async getMaxPrice() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getMaxPrice",
        {
          params: { aid: this.$route.query.id }
        }
      );
      this.maxPrice = res;
      console.log(this.maxPrice);
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 70%;
  margin: 30px auto;
}
.auction-record {
  margin-top: 20px;
}
.auction-record-item {
  border-top: 1px solid rgb(112, 109, 109);
  margin-top: 10px;
}
</style>