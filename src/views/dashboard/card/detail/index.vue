<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <i class="iconfont icon-Info-copy-copy-copy"></i>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
        <!-- //*插槽 -->
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "detail",
  props: ["title", "count"],
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #9b9999;
}
.card-content {
  font-size: 30px;
  padding: 10px 0px;
}
.card-charts {
  height: 50px;
}
.card-footer {
  border-top: 1px solid #eee;
  padding-top: 10px;
}
.icon-Info-copy-copy-copy{
    color: black;
}
</style>