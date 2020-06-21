<template>
  <div class="userProductBox">
    <el-card :body-style="{ padding: '20px 0' }">
      <el-tabs tab-position="left" @tab-click="clickTab" v-model="activeName">
        <el-tab-pane style="height:700px" name="myProduct" lazy>
          <span slot="label"><i class="el-icon-s-goods"></i> 我的商品</span>
          <div class="productBox" v-for="item in usrProductList" :key="item.id">
            <div class="left">
              <div class="imgBox">
                <el-image
                  style="width:90px;height:90px"
                  :src="item.imgUrl"
                  fit="contain"
                ></el-image>
              </div>
              <div class="p-info">
                <div class="pName">{{ item.skuName }}</div>
                <div class="pDesc">
                  {{ item.skuDesc }}
                </div>
              </div>
            </div>
            <div class="right">
              <!-- 修改按钮 -->
              <el-tooltip effect="dark" content="修改" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="editProductInfo(item)"
                ></el-button>
              </el-tooltip>
              <!-- 删除按钮 -->
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeProduct(item)"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane style="height:700px" name="myWanted" lazy>
          <span slot="label"><i class="el-icon-s-order"></i> 我的求购</span>
          <div
            class="productBox"
            v-for="item in productWantedList"
            :key="item.id"
          >
            <div class="left">
              <div class="imgBox">
                <el-image
                  style="width:90px;height:90px"
                  :src="item.imgUrl"
                  fit="contain"
                ></el-image>
              </div>
              <div class="p-info">
                <div class="pName">{{ item.productName }}</div>
                <div class="pDesc">
                  {{ item.description }}
                </div>
              </div>
            </div>
            <div class="right">
              <!-- 修改按钮 -->
              <el-tooltip effect="dark" content="修改" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="editProductWanted(item)"
                ></el-button>
              </el-tooltip>
              <!-- 删除按钮 -->
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeProductWanted(item)"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane style="height:700px" name="myAuction" lazy>
          <span slot="label"><i class="el-icon-goods"></i> 我的拍卖</span>
          <div class="productBox" v-for="item in auctionList" :key="item.id">
            <div class="left">
              <div class="imgBox">
                <el-image
                  style="width:90px;height:90px"
                  :src="item.imgUrl"
                  fit="contain"
                ></el-image>
              </div>
              <div class="p-info">
                <div class="pName">{{ item.skuName }}</div>
                <div class="pDesc">
                  {{ item.skuDesc }}
                </div>
              </div>
            </div>
            <div class="right">
              <!-- 修改按钮 -->
              <el-tooltip effect="dark" content="修改" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="editAuctionInfo(item)"
                ></el-button>
              </el-tooltip>
              <!-- 删除按钮 -->
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeAuction(item)"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane style="height:700px" name="myAuctionRecord" lazy>
          <span slot="label"><i class="el-icon-goods"></i> 拍卖记录</span>
          <div
            class="productBox"
            v-for="item in auctionRecordList"
            :key="item.id"
          >
            <div class="left" @click="toAcutionInfo(item)">
              <div class="imgBox">
                <el-image
                  style="width:90px;height:90px"
                  :src="item.imgUrl"
                  fit="contain"
                ></el-image>
              </div>
              <div class="p-info">
                <div class="pName">{{ item.skuName }}</div>
                <div class="pDesc">
                  {{ item.skuDesc }}
                </div>
              </div>
            </div>
            <div class="right">
              <div class="enddate">结束时间：{{ item.enddate }}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 修改商品 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @closed="editDialogClosed"
    >
      <el-form :model="editForm" label-width="80px" ref="editFormRef">
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" v-model="editForm.skuName">
          </el-input>
        </el-form-item>
        <el-form-item label="商品简介">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入商品简介"
            maxlength="200"
            show-word-limit
            v-model="editForm.skuDesc"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input
            style="width:50%"
            placeholder="请输入价格"
            v-model="editForm.price"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="微信">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="editForm.wechat"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="editForm.phone"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="QQ">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="editForm.qq"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="img-uploader"
            action="http://127.0.0.1:8084/imgUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="image" />
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改求购 -->
    <el-dialog
      title="修改求购信息"
      :visible.sync="editWantedDialogVisible"
      width="50%"
      @closed="editWantedDialogClosed"
    >
      <el-form :model="editForm" label-width="80px" ref="editFormRef">
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" v-model="editForm.productName">
          </el-input>
        </el-form-item>
        <el-form-item label="商品简介">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入商品简介"
            maxlength="200"
            show-word-limit
            v-model="editForm.description"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="微信">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="editForm.wechat"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="editForm.phone"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="QQ">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="editForm.qq"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="img-uploader"
            action="http://127.0.0.1:8084/imgUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="image" />
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editWantedDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editWantedSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改拍卖 -->
    <el-dialog
      title="修改拍卖信息"
      :visible.sync="editAuctionDialogVisible"
      width="50%"
      @closed="editAuctionDialogClosed"
    >
      <el-form :model="editForm" label-width="80px" ref="editFormRef">
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" v-model="editForm.skuName">
          </el-input>
        </el-form-item>
        <el-form-item label="商品简介">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入商品简介"
            maxlength="200"
            show-word-limit
            v-model="editForm.skuDesc"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="微信">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="editForm.wechat"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="editForm.phone"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="QQ">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="editForm.qq"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="img-uploader"
            action="http://127.0.0.1:8084/imgUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="image" />
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAuctionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAuctionSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usrProductList: [],
      editForm: {},
      editDialogVisible: false,
      imageUrl: "",
      productWantedList: [],
      activeName: "myProduct",
      editWantedDialogVisible: false,
      auctionList: [],
      editAuctionDialogVisible: false,
      auctionRecordList: []
    };
  },
  created() {
    this.getProductListByUser();
  },
  methods: {
    async getProductListByUser() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getProductByUser"
      );
      this.usrProductList = res;
    },
    async getProductWantedByUser() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getProductWantedByUser"
      );
      this.productWantedList = res;
    },
    editProductInfo(prodcutInfo) {
      this.editForm = prodcutInfo;

      this.editDialogVisible = true;
      this.imageUrl = prodcutInfo.imgUrl;
    },
    async removeProduct(productInfo) {
      const confirmResult = await this.$confirm("是否删除该商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);

      if (confirmResult != "confirm") {
        return this.$Message.info("已取消删除");
      }

      const { data: resRemove } = await this.$http.post(
        "http://127.0.0.1:8084/removeProduct",
        productInfo
      );
      if (resRemove === "success") {
        this.$Message.success("删除成功");
      } else {
        this.$Message.error("删除失败!");
      }
      this.getProductListByUser();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res;
      this.editForm.imgUrl = res;
    },
    editDialogClosed() {
      this.getProductListByUser();
    },
    async editSubmit() {
      const { data: res } = await this.$http.post(
        "http://127.0.0.1:8084/editProductInfo",
        this.editForm
      );
      if (res === "success") {
        this.$Message.success("修改成功!");
      } else {
        this.$Message.error("修改失败!");
      }
      this.editDialogVisible = false;
    },
    clickTab(tab, event) {
      if (tab.name === "myWanted") {
        this.getProductWantedByUser();
      }
      if (tab.name === "myAuction") {
        this.getAuctionByUser();
      }
      if (tab.name === "myAuctionRecord") {
        this.getAuctionRecordByUser();
      }
    },
    editProductWanted(productWanted) {
      this.editForm = productWanted;
      this.imageUrl = productWanted.imgUrl;
      this.editWantedDialogVisible = true;
    },
    editWantedDialogClosed() {
      this.getProductWantedByUser();
    },
    async removeProductWanted(productWanted) {
      const confirmResult = await this.$confirm("是否删除该商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);

      if (confirmResult != "confirm") {
        return this.$Message.info("已取消删除");
      }

      const { data: resRemove } = await this.$http.post(
        "http://127.0.0.1:8084/removeProductWanted",
        productWanted
      );
      if (resRemove === "success") {
        this.$Message.success("删除成功");
      } else {
        this.$Message.error("删除失败!");
      }
      this.getProductWantedByUser();
    },
    async editWantedSubmit() {
      const { data: res } = await this.$http.post(
        "http://127.0.0.1:8084/editProductWanted",
        this.editForm
      );
      if (res === "success") {
        this.$Message.success("修改成功!");
      } else {
        this.$Message.error("修改失败!");
      }
      this.editWantedDialogVisible = false;
    },
    // 我的拍卖
    async getAuctionByUser() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getAuctionByUser"
      );

      this.auctionList = res;
    },
    editAuctionInfo(auction) {
      this.editForm = auction;
      this.editAuctionDialogVisible = true;
      this.imageUrl = auction.imgUrl;
    },
    async removeAuction(auction) {
      const confirmResult = await this.$confirm("是否删除该商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);

      if (confirmResult != "confirm") {
        return this.$Message.info("已取消删除");
      }

      const { data: resRemove } = await this.$http
        .post("http://127.0.0.1:8084/removeAuction", auction)
        .catch(error => {
          if (error) {
            return this.$Message.error("删除失败！");
          }
        });
      if (resRemove === "success") {
        this.$Message.success("删除成功");
      } else {
        this.$Message.error("删除失败!");
      }
      this.getAuctionByUser();
    },
    editAuctionDialogClosed() {
      this.getAuctionByUser();
    },
    async editAuctionSubmit() {
      const { data: res, status: status } = await this.$http
        .post("http://127.0.0.1:8084/editAuction", this.editForm)
        .catch(error => {
          if (error) {
            return this.$Message.error("修改失败！");
          }
        });
      if (status === 200 && res === "success") {
        this.$Message.success("修改成功！");
      }
    },
    // 拍卖记录
    async getAuctionRecordByUser() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getAuctionRecordByUser"
      );
      console.log(res);
      this.auctionRecordList = res;
    },
    toAcutionInfo(auction) {
      this.$router.push({ path: "/auctionInfo", query: { id: auction.id } });
    }
  }
};
</script>

<style lang="less" scoped>
.userProductBox {
  width: 60%;
  margin: 20px auto;
}
.el-tab-pane {
  overflow-y: scroll;
}
.productBox {
  height: 100px;
  margin: 0 10px 10px 0;
  display: flex;
  justify-content: space-between;
}
.left {
  display: flex;
}
.imgBox {
  margin: 5px 0;
}
.p-info {
  margin: 10px 0 0 10px;
}
.pName {
  margin-bottom: 10px;
  overflow: hidden;
  width: 400px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.pDesc {
  font-size: 13px;
  overflow: hidden;
  width: 400px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.right {
  margin-right: 10px;
  padding: 30px 0 30px 0;
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
</style>