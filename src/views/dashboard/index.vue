<template>
  <div>
    <card />
    <sale />
    <foot />
  </div>
</template>

<script>
import card from "./card";
import sale from "./sale";
import foot from "./foot";
export default {
  name: "Dashboard",
  components: {
    card,
    sale,
    foot,
  },
  mounted() {
    this.$store.dispatch('getdata')
  },
};
</script>

<style  scoped>
</style>
