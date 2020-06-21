<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminHomeView' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" v-model="queryInfo.query">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="dialogVisible = true"
              >添加用户</el-button
            >
          </div>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->

      <el-table stripe style="width: 100%" :data="userList">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别"></el-table-column>
        <el-table-column
          prop="personalizedSignature"
          label="个性签名"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="editUserDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeUser(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      @close="dialogClosed"
    >
      <span>
        <el-form
          label-width="80px"
          :model="addUserForm"
          :rules="addUserFormRules"
          ref="addUserFormRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="addUserForm.username"
              @blur="nicknameSync(addUserForm.username)"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="addUserForm.password"
              show-password
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input
              v-model="addUserForm.nickname"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="addUserForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio v-model="addUserForm.status" :label="1">启用</el-radio>
            <el-radio v-model="addUserForm.status" :label="0">禁用</el-radio>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio v-model="addUserForm.gender" :label="0">保密</el-radio>
            <el-radio v-model="addUserForm.gender" :label="1">男</el-radio>
            <el-radio v-model="addUserForm.gender" :label="2">女</el-radio>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="dialogEditVisible"
      width="30%"
      @closed="editDialogClosed"
    >
      <el-form
        :model="editForm"
        label-width="80px"
        ref="editFormRef"
        :rules="editUserFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="editForm.password"
            show-password
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="editForm.gender">
            <el-radio :label="'0'">保密</el-radio>
            <el-radio :label="'1'">男</el-radio>
            <el-radio :label="'2'">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="个性签名" prop="personalizedSignature">
          <el-input v-model="editForm.personalizedSignature"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      // 获取用户列表数据的对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      // 控制对话框的显示和隐藏
      dialogVisible: false,
      dialogEditVisible: false,
      // 添加用户数据
      addUserForm: {
        username: "",
        password: "666666",
        nickname: "",
        phone: null,
        status: 1,
        icon: null,
        gender: 0
      },
      //添加用户验证规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 16, message: "用户名长度为6~16字符", trigger: "blur" }
        ]
      },
      // 修改用户数据
      editForm: {},
      //修改用户验证规则
      editUserFormRules: {
        username: [
          { min: 4, max: 16, message: "用户名长度为6~16字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("/getAllUser", {
        params: this.queryInfo
      });
      if (res) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].gender == 1) {
            res[i].gender = "男";
          } else if (res[i].gender == 2) {
            res[i].gender = "女";
          } else {
            res[i].gender = "保密";
          }
        }
        this.userList = res.userList;
        this.total = res.totalPageNum;
      } else {
        return this.$Message.error("获取用户列表失败!");
      }
    },
    // 每一页条数改变
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 页码值改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getUserList();
    },
    // 监听状态开关
    async userStateChanged(userInfo) {
      const { data: result } = await this.$http.post("/userUpdate", userInfo);
      if (result == null) {
        userInfo.status = !userInfo.status;
        return this.$Message.error("更新用户状态失败！");
      } else {
        return this.$Message.success("更新用户状态成功!");
      }
    },
    //添加用户是昵称默认为用户名
    nicknameSync(name) {
      this.addUserForm.nickname = name;
    },
    //关闭对话框重置表单
    dialogClosed() {
      this.$refs.addUserFormRef.resetFields();
    },
    //添加用户BTn
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/addUser",
          this.addUserForm
        );
        if (res == null) {
          this.$Message.error("添加用户失败！");
        } else {
          this.$Message.success("添加用户成功!");
        }
        this.dialogVisible = false;
        this.getUserList();
      });
    },
    // 修改用户对话框显示
    editUserDialog(userInfo) {
      console.log(userInfo);
      this.editForm = userInfo;
      this.dialogEditVisible = true;
    },
    //关闭修改对话框重置
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户BTN
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: resEdit } = await this.$http.post(
          "/userUpdate",
          this.editForm
        );
        if (resEdit == null) {
          this.$Message.error("修改用户失败!");
        } else {
          this.$Message.success("修改用户成功");
        }
        this.dialogEditVisible = false;
        this.getUserList();
      });
    },
    //删除用户BTN
    async removeUser(userInfo) {
      //弹框
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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

      const { data: resRemove } = await this.$http.post(
        "/removeUser",
        userInfo
      );
      if (resRemove != 200) {
        this.$Message.error("删除失败！");
      } else {
        this.$Message.success("删除成功!");
      }
      this.getUserList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>