<template>
  <div class="cardBox">
    <el-card>
      <h2 style="text-align:center">发布拍卖</h2>

      <el-form
        ref="releaseAuctionFormRef"
        :model="releaseAuctionForm"
        label-width="80px"
      >
        <el-form-item label="商品名称">
          <el-input
            placeholder="请输入商品名称"
            v-model="releaseAuctionForm.skuName"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="商品简介">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入商品简介"
            maxlength="200"
            show-word-limit
            v-model="releaseAuctionForm.skuDesc"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input
            style="width:50%"
            placeholder="请输入价格"
            v-model="releaseAuctionForm.price"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="选择时间">
          <el-date-picker
            v-model="releaseAuctionForm.starttime"
            type="datetime"
            placeholder="选择开始时间"
          >
          </el-date-picker>
          <el-date-picker
            style="margin-left:10px"
            v-model="releaseAuctionForm.endtime"
            type="datetime"
            placeholder="选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader
            v-model="selectCatalog"
            :options="catalog"
            :props="props"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="微信">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="releaseAuctionForm.wechat"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="releaseAuctionForm.phone"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="QQ">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="releaseAuctionForm.qq"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="图片上传">
          <el-upload
            action="http://127.0.0.1:8084/imgUpload"
            list-type="picture-card"
            ref="uploadRef"
            :limit="1"
            :on-success="onSuccess"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" class="btn">提交</el-button>
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
      releaseAuctionForm: {
        skuName: "",
        skuDesc: "",
        price: "",
        catalog3Id: "",
        wechat: null,
        phone: null,
        qq: null,
        imgUrl: "",
        starttime: "",
        endtime: ""
      },
      //   级联选择框
      selectCatalog: [],
      catalog: [],
      props: {
        value: "id",
        label: "name",
        children: "catalog"
      },
      //   图片
      disabled: false,
      dialogVisible: false,
      dialogImageUrl: "",
      token: ""
    };
  },
  created() {
    this.getToken();
    this.getCataList();
  },
  methods: {
    getToken() {
      this.token = localStorage.getItem("token");
    },
    //   获取分类数据
    async getCataList() {
      const { data: resCatalog } = await this.$http.get(
        "http://127.0.0.1:8084/getCatalogList"
      );
      this.catalog = resCatalog;
    },
    async submit() {
      if (this.token === null) {
        this.$Message.error("请登录后发布拍卖!");
        return this.$router.push("/userLogin?rUrl=" + this.$route.path);
      }
      const { data: res, status: status } = await this.$http
        .post("http://127.0.0.1:8084/releaseAuction", this.releaseAuctionForm)
        .catch(error => {
          if (error) {
            console.log(error);
            return this.$Message.error("发布失败！");
          }
        });

      if (status === 200) {
        this.$Message.success("成功发布拍卖!");
        this.$refs.releaseAuctionFormRef.resetFields();
        return this.reload();
      }
    },
    handleChange() {
      this.releaseAuctionForm.catalog3Id = this.selectCatalog[
        this.selectCatalog.length - 1
      ];
    },
    // 图片上传
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file) {
      this.$refs.uploadRef.clearFiles();
    },
    onSuccess(res) {
      this.releaseAuctionForm.imgUrl = res;
    }
  }
};
</script>

<style lang="less" scoped>
.cardBox {
  width: 50%;
  position: relative;
  left: 25%;
}
.btn {
  position: relative;
  left: 35%;
  width: 20%;
}
</style>