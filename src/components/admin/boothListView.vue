<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminHomeView' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>摊位管理</el-breadcrumb-item>
      <el-breadcrumb-item>摊位列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 用户列表区 -->

      <el-table stripe style="width: 60%" :data="boothList" border>
        <el-table-column
          prop="id"
          label="摊位号"
          width="80px"
        ></el-table-column>
        <el-table-column prop="nickname" label="所属用户昵称"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeBooth(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boothList: []
    };
  },
  created() {
    this.getBoothList();
  },
  methods: {
    async getBoothList() {
      const { data: res } = await this.$http.get(
        "http://127.0.0.1:8081/getBoothList"
      );
      this.boothList = res;
    },
    async removeBooth(booth) {
      //弹框
      const confirmResult = await this.$confirm(
        "此操作将永久删除该摊位, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult != "confirm") {
        return this.$Message.info("已取消删除");
      }
      const { data: res, status: status } = await this.$http
        .post("/removeBooth", booth)
        .catch(error => {
          if (error) {
            this.$Message.error("删除失败!");
          }
        });
      if (status === 200 && res === "success") {
        this.$Message.success("删除成功!");
      }
      this.getBoothList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>