<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminHomeView' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addCatalogDialog"
              >添加分类</el-button
            >
          </div>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <zk-table
        class="zkTable"
        :data="catalog"
        :columns="columns"
        children-prop="catalog"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :border="true"
        :show-row-hover="false"
      >
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.level == 1">一级</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.level == 2"
            >二级</el-tag
          >
          <el-tag type="info" size="mini" v-if="scope.row.level == 3"
            >三级</el-tag
          >
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="editCatalogDialog(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteCatalogBtn(scope.row)"
            >删除</el-button
          >
        </template>
      </zk-table>
      <!-- 分页 -->
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatalogDialogVisible"
      @closed="addCatalogDiaClosed"
    >
      <span>
        <el-form
          ref="addCatalogFormRef"
          :model="addCatalogForm"
          label-width="80px"
          :rules="addCatalogFormRules"
        >
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="addCatalogForm.name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              :options="pCatalog"
              clearable
              :props="props"
              v-model="selectCatalog"
              @change="selectCatalogChange"
              :change-on-select="true"
            ></el-cascader
          ></el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatalogDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatalogDialogBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog title="修改分类" :visible.sync="editCataLogDialogVisible">
      <span
        ><el-form
          ref="editCatalogFormRef"
          :model="editCatalogForm"
          label-width="80px"
          :rules="addCatalogFormRules"
        >
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="editCatalogForm.name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCataLogDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCatalogDialogBtn"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类数据列表
      catalog: [],
      columns: [
        { label: "分类名称", prop: "name" },
        { label: "排序", type: "template", template: "order" },
        { label: "操作", type: "template", template: "opt" }
      ],

      // 添加分类对话框显示参数
      addCatalogDialogVisible: false,
      //添加分类数据结构
      addCatalogForm: { pid: 0, name: "", level: 1 },
      //添加分类表单验证
      addCatalogFormRules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 1, max: 20, message: "分类名称长度为1~20", trigger: "blur" }
        ]
      },
      //父级分类数据列表
      pCatalog: [],
      props: {
        value: "id",
        label: "name",
        children: "catalog"
      },
      //选中的父级分类数据
      selectCatalog: [],
      //修改分类对话框显示参数
      editCataLogDialogVisible: false,
      //修改分类对话框表单数据
      editCatalogForm: { id: "", name: "", pid: "", level: 1 }
    };
  },
  created() {
    this.getCataList();
  },
  methods: {
    addCatalogDialog() {
      this.addCatalogDialogVisible = true;
      this.getParentCataList();
    },
    //请求获取商品分类数据列表
    async getCataList() {
      const { data: resCatalog } = await this.$http.get("/getCatalogList");
      this.catalog = resCatalog;
    },
    //请求获取父级分类数据
    async getParentCataList() {
      const { data: resParentCatalog } = await this.$http.get(
        "/getParentCatalogList"
      );

      this.pCatalog = resParentCatalog;
    },
    //级联选择器change
    selectCatalogChange() {
      if (this.selectCatalog.length > 0) {
        this.addCatalogForm.pid = this.selectCatalog[
          this.selectCatalog.length - 1
        ];
        this.addCatalogForm.level = this.selectCatalog.length + 1;
      } else {
        this.addCatalogForm.pid = 0;
        this.addCatalogForm.level = 1;
      }
    },
    //对话框确定提交表单
    addCatalogDialogBtn() {
      this.$refs.addCatalogFormRef.validate(async valid => {
        const { data: resAddCatalog } = await this.$http.post(
          "/addCatalog",
          this.addCatalogForm
        );
        if (resAddCatalog != 200) {
          this.$Message.error("添加失败");
        } else {
          this.$Message.success("添加成功");
        }
        this.addCatalogDialogVisible = false;
        this.getCataList();
      });
    },
    //关闭重置对话框
    addCatalogDiaClosed() {
      this.selectCatalog = null;
      this.$refs.addCatalogFormRef.resetFields();
    },
    //删除商品分类
    async deleteCatalogBtn(catalogInfo) {
      //弹框
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
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

      const { data: resDeleteCatalog } = await this.$http.post(
        "/deleteCatalog",
        catalogInfo
      );
      if (resDeleteCatalog != 200) {
        this.$Message.error("删除失败！");
      } else {
        this.$Message.success("删除成功！");
      }
      this.getCataList();
    },
    //修改商品分类
    editCatalogDialog(catalogInfo) {
      this.editCataLogDialogVisible = true;
      this.editCatalogForm.id = catalogInfo.id;
      this.editCatalogForm.name = catalogInfo.name;
      this.editCatalogForm.level = catalogInfo.level;
      if (catalogInfo.level == 2) {
        this.editCatalogForm.pid = catalogInfo.catalog1Id;
      }
      if (catalogInfo.level == 3) {
        this.editCatalogForm.pid = catalogInfo.catalog2Id;
      }
      console.log(this.editCatalogForm);
    },
    editCatalogDialogBtn() {
      this.$refs.editCatalogFormRef.validate(async valid => {
        if (!valid) return;
        const { data: resEditCatalog } = await this.$http.post(
          "/editCatalog",
          this.editCatalogForm
        );
        if (resEditCatalog != 200) {
          this.$Message.error("修改失败!");
        } else {
          this.$Message.success("修改成功!");
        }

        this.editCataLogDialogVisible = false;
        this.getCataList();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.zkTable {
  margin-top: 10px;
}
</style>