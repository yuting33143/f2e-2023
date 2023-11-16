<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n';

// TODO:i18n到時候搬到header
// 不確定搬完後這裡要不要寫個watch確認locale
const { locale } = useI18n();

const changeLanguage = value => {
  locale.value = value;
};

const languages = [
  { text: '繁體中文', value: 'tw' },
  { text: 'English', value: 'en' }
];
</script>

<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">{{ $t('header.home') }}</RouterLink>
        <RouterLink to="/history">{{ $t('header.history') }}</RouterLink>
      </nav>
    </div>
    <div class="locale-btn">
      <div
        v-for="(language, index) in languages"
        :key="index"
        @click="changeLanguage(language.value)"
      >
        {{ language.text }}
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
