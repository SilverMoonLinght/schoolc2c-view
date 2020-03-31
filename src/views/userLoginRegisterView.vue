<template>
  <el-container>
    <el-header>
      <div class="title">
        <router-link to="/home">校园二手交易</router-link>
      </div>
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
  line-height: 2.5;
  font-size: 1.5em;
  margin-left: 10%;
}
a {
  color: #fff;
}
</style>