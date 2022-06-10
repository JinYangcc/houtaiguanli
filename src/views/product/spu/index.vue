<template>
  <div>
    <el-card style="margin: 20px 0">
      <categoryselect
        @getcategoryid="getcategoryid"
        :isShow="scene != 1"
      ></categoryselect>
    </el-card>
    <el-card>
      <div v-show="scene == 1">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addspu"
          :disabled="category3Id == ''"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="spuList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                @click="addsku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                @click="editspu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                @click="handler(row)"
              ></el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deletespu(row)"
              >
                <el-button
                  style="margin-left: 10px"
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!--  -->
        <el-dialog
          :title="`${spu.spuName}的SKU`"
          :visible.sync="dialogTableVisible"
          @close="close"
        >
          <el-table
            style="width: 100%"
            :data="spuList2"
            border
            v-loading="loading"
          >
            <el-table-column prop="skuName" label="名称" width="width">
            </el-table-column>
            <el-table-column prop="price" label="价格" width="width">
            </el-table-column>
            <el-table-column prop="weight" label="重量" width="width">
            </el-table-column>
            <el-table-column prop="prop" label="默认图片" width="width">
              <template slot-scope="{ row, $index }">
                <img
                  :src="row.skuDefaultImg"
                  style="width: 100px; height: 100px"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
        <!--  -->
        <el-pagination
          style="margin-top: 20px; text-align: center"
          :current-page="page"
          :page-size="limit"
          :total="total"
          :page-sizes="[3, 5, 7]"
          layout="prev, pager, next, jumper,->,total, sizes"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <spuform v-show="scene == 2" @changescene="changescene" ref="spu" />
      <skuform v-show="scene == 3" @changeScenes="changeScenes" ref="sku" />
    </el-card>
  </div>
</template>

<script>
import categoryselect from "@/components/categoryselect";
import spuform from "./spuform";
import skuform from "./skuform";
export default {
  name: "spu",
  components: { skuform, spuform },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 3,
      total: 0,
      // isShow: true,
      scene: 1,
      dialogTableVisible: false,
      spu: {},
      spuList: [],
      spuList2: [],
      loading: true,
    };
  },
  methods: {
    //*自定义事件  传分类id发请求
    getcategoryid({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getdata();
      }
    },
    //*获取SPU数据
    async getdata() {
      const { page, limit, category3Id } = this;
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    //*分页器点击事件
    handleCurrentChange(page) {
      this.page = page;
      this.getdata();
    },
    //*分页器改变每一页展示的数据数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getdata();
    },
    //*添加属性按钮事件
    addspu() {
      this.scene = 2;
      this.$refs.spu.getadddata(this.category3Id);
    },
    //*编辑按钮事件
    editspu(row) {
      this.scene = 2;
      console.log(row);
      //*调用子组件的方法
      this.$refs.spu.initdata(row);
    },
    //*自定义事件 改变scene 切换场景
    changescene(scene) {
      this.scene = scene;
      this.getdata();
    },
    //*自定义事件 改变scene 切换场景
    changeScenes(scene) {
      this.scene = scene;
    },
    //*删除spu
    async deletespu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getdata();
      }
    },
    //*添加SKU
    addsku(row) {
      this.scene = 3;
      this.$refs.sku.getskudata(this.category1Id, this.category2Id, row);
    },
    //*查看SKU列表
    async handler(row) {
      this.dialogTableVisible = true;
      this.spu = row;
      const result = await this.$API.spu.reqSkuList(this.spu.id);
      if (result.code == 200) {
        this.spuList2 = result.data;
        this.loading = false;
      }
    },
    //*关闭弹出框的事件
    close() {
      this.loading = true;
      this.spuList2 = [];
    },
  },
};
</script>

<style>
</style>