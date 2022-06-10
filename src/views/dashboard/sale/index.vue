<template>
  <el-card class="box-card" style="margin: 10px 0">
    <div slot="header" class="clearfix">
      <el-tabs class="tabs" v-model="actionName">
        <el-tab-pane label="销售额" name="销售额"></el-tab-pane>
        <el-tab-pane label="访问量" name="访问量"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="getday">今日</span>
        <span @click="getweek">本周</span>
        <span @click="getmonth">本月</span>
        <span @click="getyear">本年</span>
        <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div>
            <h3>门店{{ title }}排名</h3>
            <!-- 为啥这样会报错啊 我不理解 -->
            <!-- <ul v-show="actionName=='销售额'">
              <li>
                <span class="rindex asc">1</span>
                <span>{{this.list.userRank[0].name}}</span>
                <span class="rvalue">{{this.list.userRank[0].money}}</span>
              </li>
              <li>
                <span class="rindex asc">2</span>
                <span>{{this.list.userRank[1].name}}</span>
                <span class="rvalue">{{this.list.userRank[1].money}}</span>
              </li>
              <li>
                <span class="rindex asc">3</span>
                <span>{{this.list.userRank[2].name}}</span>
                <span class="rvalue">{{this.list.userRank[2].money}}</span>
              </li>
              <li>
                <span class="rindex">4</span>
                <span>{{this.list.userRank[3].name}}</span>
                <span class="rvalue">{{this.list.userRank[3].money}}</span>
              </li>
              <li>
                <span class="rindex">5</span>
                <span>{{this.list.userRank[4].name}}</span>
                <span class="rvalue">{{this.list.userRank[4].money}}</span>
              </li>
              <li>
                <span class="rindex">6</span>
                <span>{{this.list.userRank[5].name}}</span>
                <span class="rvalue">{{this.list.userRank[5].money}}</span>
              </li>
              <li>
                <span class="rindex">7</span>
                <span>{{this.list.userRank[6].name}}</span>
                <span class="rvalue">{{this.list.userRank[6].money}}</span>
              </li>
            </ul> -->
            <ul>
              <li>
                <span class="rindex asc">1</span>
                <span>肯德基</span>
                <span class="rvalue">1254698</span>
              </li>
              <li>
                <span class="rindex asc">2</span>
                <span>肯德基</span>
                <span class="rvalue">1254698</span>
              </li>
              <li>
                <span class="rindex asc">3</span>
                <span>肯德基</span>
                <span class="rvalue">1254698</span>
              </li>
              <li>
                <span class="rindex">4</span>
                <span>肯德基</span>
                <span class="rvalue">1254698</span>
              </li>
              <li>
                <span class="rindex">5</span>
                <span>肯德基</span>
                <span class="rvalue">1254698</span>
              </li>
              <li>
                <span class="rindex">6</span>
                <span>肯德基</span>
                <span class="rvalue">1254698</span>
              </li>
              <li>
                <span class="rindex">7</span>
                <span>肯德基</span>
                <span class="rvalue">1254698</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import dayjs from "dayjs";
import echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "sale",
  data() {
    return {
      actionName: "销售额",
      date: [],
      linecharts: null,
    };
  },
  mounted() {
    this.linecharts = echarts.init(this.$refs.charts);
    this.linecharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          color: "#5071c8",
          //   barWidth: 10,
          data: [],
        },
      ],
    });
  },
  computed: {
    title() {
      return this.actionName == "销售额" ? "销售额" : "访问量";
    },
    ...mapState({
      list: (state) => {
        return state.home.list;
      },
    }),
  },
  watch: {
    title() {
      this.linecharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: {
          data:
            this.actionName == "销售额"
              ? this.list.orderFullYearAxis
              : this.list.userFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data:
              this.title == "销售额"
                ? this.list.orderFullYear
                : this.list.userFullYear,
            color: "#5071c8",
          },
        ],
      });
    },
    //*监听list的变化 初始化图
    list(){
      this.linecharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: {
          data:
            this.actionName == "销售额"
              ? this.list.orderFullYearAxis
              : this.list.userFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data:
              this.title == "销售额"
                ? this.list.orderFullYear
                : this.list.userFullYear,
            color: "#5071c8",
          },
        ],
      });
    },
  },
  methods: {
    getday() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    getweek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    getmonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    getyear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
/* .el-card__header {
  border-bottom: none;
} */
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tabs {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  padding: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  text-align: center;
}
.asc {
  border-radius: 50%;
  background: black;
  color: white;
}
.rvalue {
  float: right;
}
li span {
  margin-right: 25px;
  margin-left: 10px;
}
</style>