<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <detail title="总销售额" count="¥ 126560">
            <template slot="charts">
              <span
                >周同比&nbsp;&nbsp;56.67%
                <i class="iconfont icon-shangjiantou-copy"></i
              ></span>
              &nbsp; &nbsp;<span
                >日同比&nbsp;&nbsp;19.96% &nbsp;<i
                  class="iconfont icon-xiajiantou-copy"
                ></i
              ></span>
            </template>
            <template slot="footer">
              <span>日销售额￥ 12423</span>
            </template>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="访问量" count="88460">
            <template slot="charts">
              <linecharts />
            </template>
            <template slot="footer">
              <span>日访问量&nbsp;&nbsp;1234</span>
            </template>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="支付笔数" count="88460">
            <template slot="charts">
              <barcharts />
            </template>
            <template slot="footer">
              <span>转化率&nbsp;&nbsp;65%</span>
            </template>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="运营活动效果" count="78%">
            <template slot="charts">
              <progresscharts />
            </template>
            <template slot="footer">
              <span
                >周同比&nbsp;&nbsp;12%
                <i class="iconfont icon-shangjiantou-copy"></i
              ></span>
              &nbsp; &nbsp;
              <span
                >日同比&nbsp;&nbsp;11% &nbsp;<i
                  class="iconfont icon-xiajiantou-copy"
                >
                </i
              ></span>
            </template>
          </detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import detail from "./detail";
import barcharts from "./barcharts";
import linecharts from "./linecharts";
import progresscharts from "./progresscharts";

export default {
  name: "card",
  components: {
    detail,
    linecharts,
    barcharts,
    progresscharts,
  },
};
</script>

<style>
.icon-shangjiantou-copy {
  color: red;
}
.icon-xiajiantou-copy {
  color: green;
}
</style>