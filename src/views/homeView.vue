<template>
  <el-container>
    <el-header>
      <div class="header">
        <div class="title">
          <a href="/#/home"><p>校园二手交易</p></a>
        </div>
        <el-row :gutter="20" align="middle">
          <el-col :span="2" :offset="17" class="dropDown">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                发布<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">发布商品</el-dropdown-item>
                <el-dropdown-item command="b">发布求购</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="2" class="userDo">
            <a href="/#/userLogin"><p>登录</p></a>
          </el-col>
          <el-col :span="2" class="userDo">
            <a href="/#/userRegister"><p>注册</p></a>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleCommand(command) {
      if (command == "a") {
        this.$router.push({ path: "/releaseProduct" });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-header {
  padding: 0;
}
.el-main {
  background-color: #f8f8f8;
}
.header {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0 10% 0 15%;
}
.title {
  line-height: 1;
  font-family: "Hiragino Sans GB";
  font-size: 20px;
  width: 120px;
  line-height: 1;
  float: left;
}
a {
  color: #000;
  text-decoration: none;
}
.userDo {
  width: 54px;
}
.dropDown {
  margin-top: 20px;
}
.el-dropdown-link {
  cursor: pointer;
}
</style>