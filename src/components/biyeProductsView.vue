<template>
  <div class="contain">
    <div class="left">
      <el-card :body-style="{ padding: '0px' }">
        <div class="left-header">
          <div>
            <el-avatar :size="size" :src="circleUrl"></el-avatar>
          </div>
          <div class="user-info">
            <div>{{ userInfo.nickname }}</div>
            <div class="user-personal">
              {{ userInfo.personalizedSignature }}
            </div>
          </div>
        </div>
        <div class="content">
          <div class="content-header">
            <div style="margin-left:10px" v-if="boothId !== null">
              <p>我的摊位:{{ boothId }}号</p>
            </div>
            <div style="margin-left:10px" v-if="boothId === null">
              <p>您还没有摊位</p>
            </div>
            <div style="margin:13px 10px 0 0">
              <el-tooltip
                effect="dark"
                content="创建摊位"
                placement="top"
                v-if="boothId === null"
              >
                <el-button
                  type="info"
                  icon="el-icon-plus"
                  class="btn"
                  v-if="boothId === null"
                  @click="createBooth"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="添加商品"
                placement="top"
                v-if="boothId !== null"
              >
                <el-button
                  type="info"
                  icon="el-icon-plus"
                  class="btn"
                  v-if="boothId !== null"
                  @click="addBoothProductVisible = true"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="修改商品"
                placement="top"
                v-if="boothId !== null"
              >
                <el-button
                  type="info"
                  class="btn"
                  icon="el-icon-edit"
                  v-if="boothId !== null"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="清空商品"
                placement="top"
                v-if="boothId !== null"
              >
                <el-button
                  type="info"
                  class="btn"
                  icon="el-icon-delete"
                  v-if="boothId !== null"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="content-product" v-if="boothId !== null">
            <div class="nobooth-alert" v-if="boothProduct === null">
              <p>
                您还没有发布商品!!
              </p>
            </div>
            <div class="product-box">
              <div
                class="product-item"
                v-for="item in boothProduct"
                :key="item.id"
              >
                <div class="product-item-left">
                  <div class="product-item-name">{{ item.pName }}</div>
                  <div class="product-item-desc">{{ item.pDesc }}</div>
                </div>
                <div class="product-item-right">
                  <div class="product-item-price">¥{{ item.price }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="right"></div>
    <!-- 添加摊位商品对话框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="addBoothProductVisible"
      width="30%"
      @closed="addBoothProductClosed"
    >
      <el-form
        :model="addBoothProductForm"
        label-width="80px"
        ref="addBoothProductFormRef"
      >
        <el-form-item label="商品名称" prop="pName">
          <el-input v-model="addBoothProductForm.pName"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" prop="pDesc">
          <el-input
            type="textarea"
            v-model="addBoothProductForm.pDesc"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="addBoothProductForm.price"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imgUrl">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBoothProductVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBoothProduct">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      size: "large",
      circleUrl: "",
      userInfo: {},
      boothId: null,
      boothProduct: null,
      addBoothProductVisible: false,
      dialogVisible: false,
      disabled: false,
      dialogImageUrl: "",
      addBoothProductForm: {
        pName: "",
        pDesc: "",
        price: "",
        bid: "",
        imgUrl: ""
      }
    };
  },
  created() {
    this.getUserInfoByToken();
    this.getBoothInfo();
  },
  methods: {
    async getUserInfoByToken() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8082/getUserByToken"
      );
      this.userInfo = res;
      this.circleUrl = res.icon;
    },
    async getBoothInfo() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getBoothInfo"
      );
      if (res) {
        this.boothId = res.id;
        this.getBoothProductList();
      }
    },
    async createBooth() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/createBooth"
      );
      if (res === "success") {
        this.$Message.success("创建成功");
      } else {
        return this.$Message.error("创建失败!");
      }
      this.reload();
    },
    async getBoothProductList() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getBoothProductList",
        {
          params: { bid: this.boothId }
        }
      );

      if (res) {
        this.boothProduct = res;
      }
    },
    async addBoothProduct() {
      this.addBoothProductForm.bid = this.boothId;
      const { data: res } = await this.$http.post(
        "http://127.0.0.1:8084/addBoothProduct",
        this.addBoothProductForm
      );
      if (res === "success") {
        this.$Message.success("添加成功!");
        this.reload();
      } else {
        return this.$Message.error("添加失败!");
      }
    },
    addBoothProductClosed() {
      this.$refs.addBoothProductFormRef.resetFields();
      this.$refs.uploadRef.clearFiles();
    },
    onSuccess(res) {
      this.addBoothProductForm.imgUrl = res;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove() {
      this.$refs.uploadRef.clearFiles();
    }
  }
};
</script>


<style lang="less" scoped>
.contain {
  margin: 30px 100px;
  display: flex;
}
.left {
  width: 25%;
  height: 400px;
}
.right {
  width: 70%;
  height: 700px;
  margin-left: 50px;
}
.left-header {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid rgb(192, 190, 190);
}
.user-info {
  margin-left: 10px;
}
.user-personal {
  display: block;
  margin-top: 5px;
  color: #808695;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.content-header {
  display: flex;
  font-family: "Hiragino Sans GB";
  font-size: 16px;
  justify-content: space-between;
  border-bottom: 1px solid rgb(192, 190, 190);
}
.btn {
  width: 42px;
  height: 26px;
  padding: 0;
}
.nobooth-alert {
  text-align: center;
}
.product-box {
  padding: 5px;
}
.product-item {
  display: flex;
  margin-bottom: 5px;
  justify-content: space-between;
}
.product-item-left {
  width: 50%;
}
.product-item-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
.product-item-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  color: #808695;
}
.product-item-price {
  margin: 10px 10px 0 0;
}
</style>