<script setup>
import { ref } from 'vue';
import ScaleBar from '@/components/scaleBar.vue';
</script>

<template>
  <div>history</div>
  <ScaleBar class="bar" :aPercent="10" :bPercent="20" :cPercent="70"></ScaleBar>
</template>
<style lang="scss" scoped>
.bar {
  // height: 20px;
  width: 500px;
}
</style>
