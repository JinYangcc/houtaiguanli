<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <left />
      </el-col>
      <el-col :span="12">
        <right />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import left from "./left";
import right from "./right";
export default {
  name: "foot",
  components: {
    left,
    right,
  },
};
</script>

<style>
</style>