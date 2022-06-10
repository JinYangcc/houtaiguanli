<template>
  <el-card>
    <div slot="header" class="header">
      <span style="padding:7px 0px;">线上热门搜索</span>
      <i class="el-icon-more"></i>
    </div>
    <!-- linecharts -->
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <linecharts />
        </el-col>
        <el-col :span="12">
          <linecharts />
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div>
      <el-table :data="table" style="width: 100%" border>
        <el-table-column type="index" label="排名" width="80">
        </el-table-column>
        <el-table-column prop="prop" label="搜索关键字" width="180">
          <el-input
            placeholder="请输入"
            style="width: 80%; height: 30px;line-height:30px;"
          ></el-input>
        </el-table-column>
        <el-table-column
          prop="prop"
          label="用户数"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="prop"
          label="周涨幅"
          sortable
        >
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        style="text-align: right"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import linecharts from "./linecharts";
export default {
  name: "left",
  data() {
    return {
      table: [{}],
    };
  },
  components: {
    linecharts,
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
}
</style>