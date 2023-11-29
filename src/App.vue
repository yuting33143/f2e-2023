<script setup>
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// TODO:i18n搬到header 寫個watch確認locale

console.log(route.path);
const isHomePage = computed(() => route.path == '/');
</script>

<template>
  <Header />

  <RouterView />

  <Footer v-if="!isHomePage"></Footer>
</template>

<style lang="scss">
body {
  padding-top: 99px;

  @include pad() {
    padding-top: 69px;
  }
}
</style>
