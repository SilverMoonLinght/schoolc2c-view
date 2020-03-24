<template>
  <el-container>
    <el-header>
      <h1 class="title">校园二手交易</h1>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.el-header {
  background-color: rgb(51, 51, 51);
}
.title {
  color: #fff;
  line-height: 1;
  font-family: "Hiragino Sans GB";
}
</style>