<script setup>
import { RouterView } from 'vue-router';
import Header from '@/components/Header.vue';

// TODO:i18n搬到header 寫個watch確認locale
</script>

<template>
  <Header />

  <RouterView />
</template>

<style lang="scss">
body {
  padding-top: 99px;
  @include pad() {
    padding-top: 69px;
  }
}
</style>
