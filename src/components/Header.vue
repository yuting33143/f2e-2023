<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const changeLanguage = value => {
  locale.value = value;
};

// TODO:解決重整語言跳回中文
const selectedLanguage = ref('tw');

const languages = [
  { text: '中文', value: 'tw' },
  { text: 'English', value: 'en' }
];

const selectTab = ref('current');

function changeTab(tab) {
  selectTab.value = tab;
}
</script>

<template>
  <div class="wrapper">
    <div class="logo">
      <img src="@/assets/images/logo-b.png" />
    </div>
    <div class="tab-group">
      <RouterLink
        class="tab current-tab"
        :class="{ active: selectTab == 'current', 'en-width': selectedLanguage == 'en' }"
        to="/current"
        @click="changeTab('current')"
        >{{ $t('header.current') }}</RouterLink
      >
      <RouterLink
        class="tab history-tab"
        :class="{ active: selectTab == 'history' }"
        to="/history"
        @click="changeTab('history')"
        >{{ $t('header.history') }}</RouterLink
      >
    </div>
    <div class="lang">
      <el-select v-model="selectedLanguage">
        <el-option
          v-for="(item, index) in languages"
          :key="index"
          :label="item.text"
          :value="item.value"
          @click="changeLanguage(item.value)"
        ></el-option>
        <template #prefix>
          <img src="@/assets/images/icon/langue.png" alt="" />
        </template>
      </el-select>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  height: 99px;
  background-color: $blue-bg;
  padding: 20px 88px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;

  .logo {
    img {
      height: 50px;
    }
  }
  .tab-group {
    width: 282px;
    height: 59px;
    background-color: $white;
    padding: 8px 11px;
    box-sizing: border-box;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tab {
      @include text3;
      text-decoration: none;
      color: $gray2;
      height: 43px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .current-tab {
      width: 96px;
    }
    .history-tab {
      width: 132px;
    }
    .active {
      color: $white;
      background-color: $black;
      border-radius: 16px;
    }
    .en-width {
      width: 132px;
    }
  }
}

:deep(.el-select:not(#fake-id)) {
  .el-input {
    height: 36px !important;
    width: 139px;
    &.is-focus {
      .el-input__wrapper {
        box-shadow: none !important;
      }
    }
    .el-select__caret.el-select__icon {
      color: $white;
      background-color: $black;
      border-radius: 6px;
      height: 20px;
      width: 20px;
    }
  }
  .el-input__wrapper {
    border-radius: 10px;
    padding: 1px 10px;
    box-shadow: none;
    .el-input__inner {
      font-size: 18px;
      color: $black;
    }
    &.is-focus {
      box-shadow: none !important;
    }
  }
}
</style>
