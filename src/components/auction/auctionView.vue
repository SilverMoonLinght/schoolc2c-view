<template>
  <div>
    <!-- 分类选择器 -->
    <el-row :gutter="20" class="selectGroup">
      <el-col :span="12" :offset="6">
        <el-card>
          <el-row :gutter="10">
            <el-col :span="8">
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
            <el-col :span="8">
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
            <el-col :span="8">
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
    <div class="productListBox">
      <el-row :gutter="20">
        <el-col
          :span="6"
          style="margin-bottom:20px"
          v-for="item in auctionList"
          :key="item.id"
        >
          <router-link :to="{ path: '/auctionInfo', query: { id: item.id } }">
            <el-card :body-style="{ padding: '10px' }">
              <el-image
                style="width:260px;height:270px"
                fit="cover"
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
      // 商品列表数据
      auctionList: [],
      // 分页
      queryInfo: {
        catalog3Id: null,
        pageNum: 1,
        pageSize: 16
      },
      total: 0
    };
  },
  created() {
    this.getCatalog1();
    this.getAuctionList();
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
      this.getAuctionList();
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
    async getAuctionList() {
      const { data: resPList } = await this.$http.get(
        "http://127.0.0.1:8084/getAuctionList",
        {
          params: this.queryInfo
        }
      );
      this.auctionList = resPList.auctions;
      this.total = resPList.totalPageNum;
      console.log(this.auctionList);
    },
    getPartCataProduct() {
      this.queryInfo.catalog3Id = this.select3;
      this.queryInfo.pageNum = 1;
      this.queryInfo.pageSize = 16;
      this.getAuctionList();
    },
    // 页码值改变
    handleCurrentChange(newNum) {
      this.queryInfo.pageNum = newNum;
      this.getProductList();
    }
  }
};
</script>

<style lang="less" scoped>
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
</style>