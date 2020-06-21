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
            <div style="margin:13px 10px 0 0;display:flex">
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
                content="清空商品"
                placement="top"
                v-if="boothId !== null"
              >
                <el-button
                  type="info"
                  class="btn"
                  icon="el-icon-delete"
                  v-if="boothId !== null"
                  @click="clearBoothProduct"
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
                @click="editProductDialog(item)"
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
    <div class="right">
      <el-row :gutter="100">
        <el-col
          :span="10"
          style="margin-bottom:20px"
          v-for="booth in boothList"
          :key="booth.id"
        >
          <el-card :body-style="{ padding: '0px' }">
            <div class="left-header">
              <div>
                <el-avatar :size="size" :src="booth.icon"></el-avatar>
              </div>
              <div class="user-info">
                <div>{{ booth.nickname }}</div>
                <div class="user-personal">
                  {{ booth.personalizedSignature }}
                </div>
              </div>
              <div class="user-info">
                <div style="margin-left:30px">手机：{{ booth.phone }}</div>
                <div style="margin-left:30px">摊位：{{ booth.id }}号</div>
              </div>
            </div>
            <div class="content">
              <div class="content-product">
                <div class="product-box booth-product-box">
                  <div
                    class="product-item"
                    v-for="boothProductList in booth.boothProductList"
                    :key="boothProductList.id"
                    @click="showProductDialog(boothProductList)"
                  >
                    <div style="display:flex;width:80%">
                      <el-image
                        style="width:50px;height:50px"
                        :src="boothProductList.imgUrl"
                        fit="contain"
                      ></el-image>
                      <div style="width:50%">
                        <div class="product-item-name">
                          {{ boothProductList.pName }}
                        </div>
                        <div class="product-item-desc">
                          {{ boothProductList.pDesc }}
                        </div>
                      </div>
                    </div>
                    <div class="product-item-right">
                      <div class="product-item-price">
                        ¥{{ boothProductList.price }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
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
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBoothProductVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBoothProduct">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改摊位商品对话框 -->
    <el-dialog
      title="修改商品"
      :visible.sync="editBoothProductVisible"
      width="30%"
      @closed="editBoothProductClosed"
    >
      <el-form :model="editBoothProductForm" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="editBoothProductForm.pName"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" prop="pDesc">
          <el-input
            type="textarea"
            v-model="editBoothProductForm.pDesc"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="editBoothProductForm.price"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imgUrl">
          <el-upload
            class="img-uploader"
            action="http://127.0.0.1:8084/imgUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="image" />
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editBoothProductVisible = false">取 消</el-button>
        <el-button type="danger" @click="deleteBoothProduct">删 除</el-button>
        <el-button type="primary" @click="editBoothProduct">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 显示商品详情对话框 -->
    <el-dialog
      :visible.sync="showBoothProductVisible"
      width="50%"
      @closed="showBoothProductClosed"
    >
      <el-row :gutter="20">
        <el-col :offset="2" :span="10">
          <el-image
            style="width: 300px; height: 300px"
            fit="fit"
            :src="showImgUrl"
          >
          </el-image>
        </el-col>
        <el-col :span="10" offset="2">
          <p class="pName">{{ showBoothProduct.pName }}</p>
          <p style="font-size:14px;color:#616776">
            {{ showBoothProduct.pDesc }}
          </p>
          <div class="info-item">
            <i class="el-icon-coin i-title"></i>
            <span style="margin-left:10px">¥{{ showBoothProduct.price }}</span>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      token: "",
      size: "large",
      circleUrl: "",
      userInfo: {},
      boothId: null,
      boothProduct: null,
      boothList: [],
      // 添加商品
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
      },
      //修改商品
      editBoothProductVisible: false,
      editBoothProductForm: {},
      imageUrl: "",
      // 显示商品详情
      showBoothProductVisible: false,
      showBoothProduct: {},
      showImgUrl: ""
    };
  },
  created() {
    this.getUserInfoByToken();
    this.getBoothInfo();
  },
  methods: {
    async getUserInfoByToken() {
      this.token = localStorage.getItem("token");

      if (this.token !== null && this.token !== "") {
        const { data: res } = await this.$http.get(
          "http://127.0.0.1:8082/getUserByToken"
        );
        this.userInfo = res;
        this.circleUrl = res.icon;
      }
    },
    async getBoothInfo() {
      if (this.token !== null && this.token !== "") {
        const { data: res } = await this.$http.get(
          "http://127.0.0.1:8084/getBoothInfo"
        );
        if (res) {
          this.boothId = res.id;
          this.getBoothProductList();
        }
      }
      this.getBoothList();
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
    async getBoothList() {
      const { data: res, status: status } = await this.$http.get(
        "http://127.0.0.1:8084/getBoothList",
        {
          params: { bid: this.boothId }
        }
      );
      this.boothList = res;
    },

    // 添加摊位商品
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
    async clearBoothProduct() {
      const confirmResult = await this.$confirm("是否清空摊位！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);

      if (confirmResult != "confirm") {
        return this.$Message.info("已取消删除");
      }
      const { data: res } = await this.$http
        .get("http://127.0.0.1:8084/clearBoothProduct", {
          params: { bid: this.boothId }
        })
        .catch(error => {
          if (error) {
            return this.$Message.error("清空失败！");
          }
        });

      if (res === "success") {
        this.$Message.success("清空成功!");
        this.reload();
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
    },
    // 修改商品
    editProductDialog(productInfo) {
      this.editBoothProductForm = productInfo;
      this.imageUrl = productInfo.imgUrl;
      this.editBoothProductVisible = true;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res;
      this.editBoothProductForm.imgUrl = res;
    },
    async editBoothProduct() {
      const { data: res } = await this.$http.post(
        "http://127.0.0.1:8084/editBoothProduct",
        this.editBoothProductForm
      );
      if (res === "success") {
        this.$Message.success("修改成功!");
        this.getBoothProductList();
      } else {
        return this.$Message.error("修改失败!");
      }

      this.editBoothProductVisible = false;
    },
    editBoothProductClosed() {
      this.getBoothProductList();
    },
    // 删除商品
    async deleteBoothProduct() {
      //弹框
      const confirmResult = await this.$confirm("是否删除此商品！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);

      if (confirmResult != "confirm") {
        return this.$Message.info("已取消删除");
      }

      const { data: res } = await this.$http.post(
        "http://127.0.0.1:8084/deleteBoothProduct",
        this.editBoothProductForm
      );
      if (res === "success") {
        this.$Message.success("删除成功");
      } else {
        return this.$Message.error("删除失败");
      }
      this.getBoothProductList();
      this.editBoothProductVisible = false;
    },

    showProductDialog(productInfo) {
      this.showBoothProduct = productInfo;
      this.showImgUrl = productInfo.imgUrl;
      this.showBoothProductVisible = true;
    },
    showBoothProductClosed() {}
  }
};
</script>


<style lang="less" scoped>
.contain {
  margin: 30px 100px;
  display: flex;
}
.left {
  width: 40%;
  height: 400px;
}
.right {
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
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.img-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.image {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: contain;
}
.img-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.booth-product-box {
  height: 200px;
  overflow-y: scroll;
}
</style>