<template>
  <div>
    <!-- 图片轮播 -->
    <el-card class="imgCarousel">
      <el-carousel height="300px" type="card">
        <el-carousel-item v-for="item in images" :key="item.id">
          <el-image :src="item.imgUrl" :fit="fit"></el-image>
        </el-carousel-item>
      </el-carousel>
    </el-card>
    <!-- 热门商品 -->
    <el-card class="hot-product-title">
      <div>热门商品</div>
    </el-card>
    <div class="hot-product">
      <el-row :gutter="20">
        <el-col
          :span="4"
          style="margin-bottom:20px"
          v-for="item in hotProduct"
          :key="item.id"
        >
          <router-link :to="{ name: 'productInfo', query: { id: item.id } }">
            <el-card :body-style="{ padding: '10px' }">
              <el-image
                style="width:200px;height:200px"
                :fit="fit"
                :src="item.imgUrl"
              >
                <div slot="error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div class="pDesc">
                <p class="skuName">
                  {{ item.skuName }}
                </p>
                <p class="skuDesc">
                  {{ item.skuDesc }}
                </p>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>

    <!-- 分类选择器和搜索框 -->
    <el-row :gutter="20" class="selectGroup">
      <el-col :span="18" :offset="3">
        <el-card>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-input
                type="text"
                v-model="queryInfo.searchInfo"
                @change="searchChange"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="searchBtn"
                >
                </el-button>
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-select
                v-model="select1"
                clearable
                placeholder="请选择"
                @change="getCatalog2"
                @clear="clearAllSelect"
              >
                <el-option
                  v-for="item in catalog1"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select
                v-model="select2"
                clearable
                placeholder="请选择"
                @change="getCatalog3"
                @clear="clearSelect2"
              >
                <el-option
                  v-for="item in catalog2"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select
                v-model="select3"
                clearable
                placeholder="请选择"
                @change="getPartCataProduct"
                @clear="clearSelect3"
              >
                <el-option
                  v-for="item in catalog3"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!-- 商品展示 -->
    <div class="errorText" v-show="errorTextShow">
      <p>无商品</p>
    </div>
    <div class="productListBox" v-show="pShow">
      <el-row :gutter="20">
        <el-col
          :span="6"
          style="margin-bottom:20px"
          v-for="item in productList"
          :key="item.id"
        >
          <router-link :to="{ name: 'productInfo', query: { id: item.id } }">
            <el-card :body-style="{ padding: '10px' }">
              <el-image
                style="width:260px;height:270px"
                :fit="fit"
                :src="item.imgUrl"
              >
                <div slot="error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div class="pDesc">
                <p class="skuName">
                  {{ item.skuName }}
                </p>
                <p class="skuDesc">
                  {{ item.skuDesc }}
                </p>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pageNum"
        :page-size="queryInfo.pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        class="pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      fit: "cover",
      images: [
        { id: 0, imgUrl: require("../assets/img/1822.jpg_wh1200.jpg") },
        {
          id: 1,
          imgUrl: require("../assets/img/61528466c77dc58a5479e4c1a70cba43.jpg")
        },
        {
          id: 2,
          imgUrl: require("../assets/img/b72fda010b03f3f86a3820099c2a53a5.jpg")
        }
      ],
      pid: {
        catalog1Id: "",
        catalog2Id: ""
      },
      select1: "",
      catalog1: [],
      select2: "",
      catalog2: [],
      select3: "",
      catalog3: [],
      pShow: false,
      errorTextShow: true,
      // 商品列表数据
      productList: [],
      // 分页
      queryInfo: {
        catalog3Id: null,
        pageNum: 1,
        pageSize: 16,
        searchInfo: null
      },
      total: 0,
      hotProduct: []
    };
  },
  created() {
    this.getCatalog1();
    this.getProductList();
    this.getHotProduct();
  },
  methods: {
    // 获取一级分类
    async getCatalog1() {
      const { data: resCatalog1 } = await this.$http.get(
        "http://127.0.0.1:8084/getCatalog1"
      );
      this.catalog1 = resCatalog1;
    },
    async getCatalog2() {
      this.pid.catalog1Id = this.select1;
      const { data: resCatalog2 } = await this.$http.get(
        "http://127.0.0.1:8084/getCatalog2",
        {
          params: this.pid
        }
      );
      this.catalog2 = resCatalog2;
    },
    async getCatalog3() {
      this.pid.catalog2Id = this.select2;
      const { data: resCatalog3 } = await this.$http.get(
        "http://127.0.0.1:8084/getCatalog3",
        {
          params: this.pid
        }
      );
      this.catalog3 = resCatalog3;
    },
    clearAllSelect() {
      this.select2 = null;
      this.select3 = null;
      this.getProductList();
      this.reload();
    },
    clearSelect2() {
      this.select3 = null;
    },
    clearSelect3() {
      this.queryInfo.catalog3Id = null;
      this.queryInfo.pageNum = 1;
      this.queryInfo.pageSize = 16;
    },
    // 获取商品列表
    async getProductList() {
      const { data: resPList } = await this.$http.get(
        "http://127.0.0.1:8084/getProductList",
        {
          params: this.queryInfo
        }
      );
      if (
        this.resPList?.productInfoList === null ||
        this.resPList?.productInfoList.length === 0
      ) {
        this.pShow = false;
        this.errorTextShow = true;
      } else {
        this.pShow = true;
        this.errorTextShow = false;
      }
      this.productList = resPList.productInfoList;
      this.total = resPList.totalPageNum;
    },
    getPartCataProduct() {
      this.queryInfo.catalog3Id = this.select3;
      this.queryInfo.pageNum = 1;
      this.queryInfo.pageSize = 16;
      this.getProductList();
    },
    // 页码值改变
    handleCurrentChange(newNum) {
      this.queryInfo.pageNum = newNum;
      if (
        this.queryInfo.searchInfo === null ||
        this.queryInfo.searchInfo === ""
      ) {
        this.getProductList();
      }
      if (
        this.queryInfo.searchInfo !== null ||
        this.queryInfo.searchInfo !== ""
      ) {
        this.searchBtn();
      }
    },
    //获取热门商品
    async getHotProduct() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getHotProduct"
      );
      this.hotProduct = res;
    },
    //模糊查询
    async searchBtn() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/searchProduct",
        {
          params: this.queryInfo
        }
      );
      this.productList = res.productSearchInfos;
      this.total = res.totalPageNum;
    },
    searchChange() {
      if (
        this.queryInfo.searchInfo === null ||
        this.queryInfo.searchInfo === ""
      ) {
        this.getProductList();
      }
    }
  }
};
</script>

<style lang="less" scoped>
a {
  color: #000;
  text-decoration: none;
}
.selectGroup {
  margin-top: 20px;
}
.imgCarousel {
  width: 68%;
  position: relative;
  left: 16%;
}
.productListBox {
  margin-top: 20px;
  width: 80%;
  position: relative;
  left: 10%;
  text-overflow: ellipsis;
}
.pDesc {
  border-top-style: solid;
  border-top-width: 1px;
  height: 100px;
}
.skuName {
  font-size: 18px;
  overflow: hidden;
  height: 25px;
  margin-bottom: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.skuDesc {
  font-size: 13px;
  overflow: hidden;
  height: 35px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.errorText {
  color: #c0c4cc;
  font-size: 14px;
  width: 20%;
  position: relative;
  left: 48%;
}
.pagination {
  position: relative;
  left: 30%;
}
.hot-product-title {
  margin-top: 10px;
  width: 1078px;
  position: relative;
  left: 200px;
}
.hot-product {
  width: 1300px;
  position: relative;
  left: 200px;
}
</style>