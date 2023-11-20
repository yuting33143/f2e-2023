import './assets/main.css';
// import Vue from 'vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import router from './router';

import en from '@/assets/lang/en';
import tw from '@/assets/lang/tw';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const i18n = createI18n({
  legacy: false,
  locale: 'tw',
  fallbackLocale: 'tw',
  globalInjection: true,
  messages: {
    tw,
    en
  }
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(ElementPlus);

app.mount('#app');
