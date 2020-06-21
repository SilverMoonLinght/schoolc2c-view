<template>
  <el-container>
    <el-header>
      <div class="header">
        <div class="title">
          <a href="/#/productList"><p>校园二手交易</p></a>
        </div>
        <div class="menus">
          <el-menu
            :default-active="this.$route.path"
            mode="horizontal"
            :router="true"
          >
            <el-menu-item index="/productList">首页</el-menu-item>
            <el-menu-item index="/productWantedList">求购</el-menu-item>
            <el-menu-item index="/auction">拍卖</el-menu-item>
            <el-menu-item index="/biyeProducts" style="color:blue"
              >毕业季</el-menu-item
            >
          </el-menu>
        </div>
        <el-row :gutter="20" align="middle" :style="rowBox" class="row">
          <el-col :span="2" :offset="18" class="dropDown" :style="dropDown">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                发布<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">发布商品</el-dropdown-item>
                <el-dropdown-item command="b">发布求购</el-dropdown-item>
                <el-dropdown-item command="h">发布拍卖</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="2" class="userDo" :style="userDo">
            <router-link to="/userLogin"><p>登录</p></router-link>
          </el-col>
          <el-col :span="2" class="userDo" :style="userDo">
            <router-link to="/userRegister"><p>注册</p></router-link>
          </el-col>
        </el-row>
        <div class="userBox" :style="userBox">
          <div class="avatar">
            <el-avatar size="medium" :src="circleUrl"></el-avatar>
          </div>
          <div class="dropDownUser">
            <el-dropdown @command="userCenter">
              <span class="el-dropdown-link">
                个人中心<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="c">个人信息</el-dropdown-item>

                <el-dropdown-item command="f">个人商品</el-dropdown-item>
                <el-dropdown-item command="d">修改密码</el-dropdown-item>
                <el-dropdown-item command="e">注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      token: "",
      circleUrl: "",
      rowBox: { width: null },
      dropDown: { margin: null, padding: null },
      userBox: { display: "none" },
      userDo: { display: null }
    };
  },
  created() {
    this.getToken();
    this.getUserByToken();
  },
  methods: {
    handleCommand(command) {
      if (command == "a") {
        this.$router.push({ path: "/releaseProduct" });
      }
      if (command === "b") {
        this.$router.push("/productWanted");
      }
      if (command === "h") {
        this.$router.push("/releaseAuction");
      }
    },
    userCenter(command) {
      if (command === "c") {
        this.$router.push("/userInfo");
      }
      if (command === "d") {
        this.$router.push("/updatePass");
      }
      if (command == "e") {
        localStorage.removeItem("token");
        this.reload();
        this.$router.push("/home");
      }
      if (command === "f") {
        this.$router.push("/userProduct");
      }
    },
    getToken() {
      this.token = localStorage.getItem("token");
      if (this.token !== null) {
        this.rowBox.width = "58%";
        this.dropDown.margin = "20px 0 0 90%";
        this.dropDown.padding = "0";
        this.userBox.display = null;
        this.userDo.display = "none";
      }
      if (this.token === null) {
        this.rowBox.width = null;
        this.dropDown.margin = null;
        this.dropDown.padding = null;
      }
    },
    async getUserByToken() {
      if (this.token !== null) {
        const { data: res } = await this.$http.get(
          "http://127.0.0.1:8082/getUserByToken",
          {
            headers: { token: this.token }
          }
        );

        if (res === "fail") {
          this.$Message.error("登录认证时间过期!");
          localStorage.removeItem("token");
          this.getToken();
          this.reload();
        }
        if (res.icon !== null) {
          this.circleUrl = res.icon;
        }
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
  padding: 0 10% 0 10%;
}
.title {
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
.dropDownUser {
  margin-top: 20px;
}
.el-dropdown-link {
  cursor: pointer;
}
.userBox {
  width: 130px;
  position: absolute;
  left: 83%;
  line-height: 1;
}
.avatar {
  margin-top: 10px;
  float: left;
  margin-right: 10px;
}
.menus {
  width: 24%;
  float: left;
}
.row {
  width: 66%;
  float: left;
}
</style>