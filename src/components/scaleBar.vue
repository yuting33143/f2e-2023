<script setup>
import { reactive, watchEffect } from 'vue';

const props = defineProps({
  aPercent: {
    type: Number
  },
  bPercent: {
    type: Number
  },
  cPercent: {
    type: Number
  }
});

const state = reactive({
  a: props.aPercent,
  b: props.bPercent,
  c: props.cPercent
});

const adjustPercents = () => {
  const total = state.a + state.b + state.c;
  if (total !== 100) {
    const adjustment = (100 - total) / 3;
    state.a += adjustment;
    state.b += adjustment;
    state.c += adjustment;
  }
};
watchEffect(() => {
  state.a = props.aPercent;
  state.b = props.bPercent;
  state.c = props.cPercent;
  adjustPercents();
});
</script>

<template>
  <div class="rectangle">
    <div class="section a" :style="{ width: state.a + '%' }"></div>
    <div class="section b" :style="{ width: state.b + '%' }"></div>
    <div class="section c" :style="{ width: state.c + '%' }"></div>
  </div>
</template>

<style scoped lang="scss">
.rectangle {
  display: flex;
  width: 100%;
  height: 25px;
  border-radius: 25px;
  overflow: hidden;
}

.section {
  height: 100%;
  transition: width 0.3s ease;
}

.a {
  background-color: $orange;
}
.b {
  background-color: $blue;
}
.c {
  background-color: $green;
}
</style>
