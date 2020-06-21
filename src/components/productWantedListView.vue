<template>
  <div class="productWantedBox">
    <el-card
      shadow="hover"
      v-for="item in productWantedList"
      :key="item.id"
      class="card"
    >
      <div class="top-user-info">
        <el-avatar size="medium" :src="item.icon"></el-avatar>
        <span class="top-data">{{ item.username }}</span>
        <span class="top-data">{{ item.school }}</span>
      </div>
      <div class="item-name">{{ item.productName }}</div>
      <div class="content">
        <div class="left-info">
          <div class="item-descriptioin">{{ item.description }}</div>
          <div class="contact">
            <div class="item-conection" v-if="item.phone != null">
              手机：{{ item.phone }}
            </div>
            <div class="item-conection" v-if="item.wechat != null">
              微信：{{ item.wechat }}
            </div>
            <div class="item-conection" v-if="item.qq != null">
              QQ：{{ item.qq }}
            </div>
          </div>
        </div>
        <div class="right">
          <el-image
            :src="item.imgUrl"
            fit="contain"
            style="width: 140px; height: 77px"
            @click="dialogVisible = true"
            v-if="item.imgUrl !== null"
          ></el-image>
          <el-dialog title="预览大图" :visible.sync="dialogVisible" width="30%">
            <span>
              <el-image :src="item.imgUrl" fit="contain"></el-image>
            </span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">
                确 定
              </el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </el-card>
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
</template>

<script>
export default {
  data() {
    return {
      productWantedList: [],
      queryInfo: {
        pageNum: 1,
        pageSize: 16
      },
      total: 0,
      dialogVisible: false
    };
  },
  created() {
    this.getProductWantedList();
  },
  methods: {
    async getProductWantedList() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8084/getProductWantedList",
        {
          params: this.queryInfo
        }
      );
      console.log(res);
      if (res === null) {
        return this.$Message.error("获取数据失败!");
      }

      this.productWantedList = res.productWanteds;

      this.total = res.totalPageNum;
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pageNum = newNum;
      this.getProductWantedList();
    }
  }
};
</script>

<style lang="less" scoped>
.productWantedBox {
  width: 70%;
  margin: 30px auto;
}
.top-user-info {
  display: flex;
  align-items: center;
}
.top-data {
  margin-left: 8px;
}
.item-name {
  margin: 12px 0;
  color: #17233d;
  font-weight: 700;
  font-size: 16px;
}
.content {
  display: flex;
  color: #616776;
  justify-content: space-between;
  font-size: 14px;
}

.pagination {
  position: relative;
  left: 30%;
}
.card {
  margin-bottom: 20px;
}
.contact {
  margin-top: 15px;
  display: flex;
  color: #888;
}
.item-conection {
  margin-right: 20px;
}
.right {
  flex: 0 0 140px;
  border-radius: 4px;
  float: left;
  margin-left: 10px;
}
</style>