<template>
  <el-card>
    <div slot="header" class="header">
      <span>线上热门搜索</span>
      <el-radio-group size="small" v-model="value">
        <el-radio-button label="全部渠道"></el-radio-button>
        <el-radio-button label="线上"></el-radio-button>
        <el-radio-button label="门店"></el-radio-button>
      </el-radio-group>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
  name: "right",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    const linecharts = echarts.init(this.$refs.charts);
    linecharts.setOption({
      title: {
        // text: "shiping",
        // subtext: "123",
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          // name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "视频广告" },
            { value: 735, name: "联盟广告" },
            { value: 580, name: "邮件营销" },
            { value: 484, name: "直接访问" },
            { value: 300, name: "搜索引擎" },
          ],
        },
      ],
    });
    //*扇形图事件
    linecharts.on("mouseover", (params) => {
      const { name, value } = params.data;
      linecharts.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style scoped>
.header {
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>