<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <i class="iconfont icon-Info-copy-copy-copy"></i>
    </div>
    <div class="main">
      <span>213123</span>
      <span>213123</span>
      <i class="iconfont icon-shangjiantou-copy"></i>
      <i class="iconfont icon-xiajiantou-copy"> </i>
    </div>
    <div class="foot">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "linecharts",
  mounted() {
    const linecharts = echarts.init(this.$refs.charts);
    linecharts.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "line",
          data: [10, 20, 15, 19, 10, 25,22,45, 17,23],
          smooth: true,
          //拐点样式
          itemStyle: {
            opacity: 0,
          },
          lineStyle: {
            color: "#fcc525",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#fcc525", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      //   布局
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      tooltip: {
        show: true,
      },
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 50px;
}
.header {
  display: flex;
  justify-content: space-between;
}
.icon-shangjiantou-copy {
  color: red;
  margin-left: 10px;
}
.icon-xiajiantou-copy {
  color: green;
  margin-left: 10px;
}
</style>