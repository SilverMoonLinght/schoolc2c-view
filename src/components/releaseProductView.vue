<template>
  <div class="cardBox">
    <el-card>
      <h2 style="text-align:center">发布商品</h2>

      <el-form
        ref="releaseProductFormRef"
        :model="releaseProductForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="商品名称" prop="skuName">
          <el-input
            placeholder="请输入商品名称"
            v-model="releaseProductForm.skuName"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="商品简介" prop="skuDesc">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入商品简介"
            maxlength="200"
            show-word-limit
            v-model="releaseProductForm.skuDesc"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            style="width:50%"
            placeholder="请输入价格"
            v-model="releaseProductForm.price"
          >
          </el-input>
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
            v-model="releaseProductForm.wechat"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="releaseProductForm.phone"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="QQ">
          <el-input
            style="width:50%"
            placeholder="微信，手机，QQ至少填一项"
            v-model="releaseProductForm.qq"
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
  data() {
    return {
      releaseProductForm: {
        skuName: "",
        skuDesc: "",
        price: "",
        catalog3Id: "",
        wechat: "",
        phone: null,
        qq: null,
        imgUrl: ""
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
      token: "",
      rules: {
        skuName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        skuDesc: [
          { required: true, message: "请输入商品介绍", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }]
      }
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
    submit() {
      this.$refs.releaseProductFormRef.validate(async valid => {
        if (this.token === null) {
          this.$Message.error("请登录后发布商品!");
          return this.$router.push("/userLogin?rUrl=" + this.$route.path);
        }
        const { data: res } = await this.$http.post(
          "http://127.0.0.1:8084/releaseProduct",
          this.releaseProductForm
        );
        if (res === 200) {
          this.$Message.success("成功发布商品!");
        }
      });
    },
    handleChange() {
      this.releaseProductForm.catalog3Id = this.selectCatalog[
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
      this.releaseProductForm.imgUrl = res;
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