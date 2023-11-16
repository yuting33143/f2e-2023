<script setup>
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">即時開票</RouterLink>
        <RouterLink to="/history">歷史開票結果</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
