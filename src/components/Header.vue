<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useWindowSizeStore } from '@/stores/windowSize.js';
const { locale } = useI18n();

const selectedLanguage = ref('tw');

const changeLanguage = value => {
  locale.value = value;
  selectedLanguage.value = value;
  localStorage.setItem('selectedLanguage', value);
};

const savedLanguage = localStorage.getItem('selectedLanguage');
if (savedLanguage) {
  locale.value = savedLanguage;
  selectedLanguage.value = savedLanguage;
}

const languages = [
  { text: '中文', value: 'tw' },
  { text: 'English', value: 'en' }
];

const selectTab = ref('');
const route = useRoute();

watch(
  () => route.path,
  newPath => {
    if (newPath === '/history') {
      selectTab.value = 'history';
    } else if (newPath === '/current') {
      selectTab.value = 'current';
    } else {
      selectTab.value = '';
    }
  }
);

function changeTab(tab) {
  selectTab.value = tab;
}

const windowSizeStore = useWindowSizeStore();

const isMobile = computed(() => windowSizeStore.width <= 768);

const isMobileHeader = ref(false);
</script>

<template>
  <div class="wrapper">
    <RouterLink class="logo" to="/" @click="selectTab = ''">
      <img src="@/assets/images/logo-b.png" />
    </RouterLink>
    <div class="tab-group" v-if="!isMobile">
      <RouterLink
        ref="tabCurrent"
        class="tab current-tab"
        :class="{ active: selectTab == 'current', 'en-width': selectedLanguage == 'en' }"
        to="/current"
        @click="changeTab('current')"
        >{{ $t('header.current') }}</RouterLink
      >
      <RouterLink
        ref="tabHistory"
        class="tab history-tab"
        :class="{ active: selectTab == 'history' }"
        to="/history"
        @click="changeTab('history')"
        >{{ $t('header.history') }}</RouterLink
      >
      <div
        v-if="selectTab !== ''"
        class="tab-indicator"
        :class="{
          'history-tab-select': selectTab == 'history',
          'en-width': selectedLanguage == 'en'
        }"
      ></div>
    </div>
    <div class="lang" v-if="!isMobile">
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
    <div
      v-if="isMobile"
      @click="
        isMobileHeader = true;
        selectTab = '';
      "
    >
      <img src="@/assets/images/button/menu.png" alt="" />
    </div>
    <el-drawer v-model="isMobileHeader" direction="rtl" size="100%" class="nav-dialog">
      <template #title>
        <RouterLink class="logo" to="/" @click="isMobileHeader = false">
          <img src="@/assets/images/logo-w.png" />
        </RouterLink>
      </template>
      <div class="dialog-content">
        <div class="mobile-tab-group">
          <RouterLink class="mobile-tab" @click="isMobileHeader = false" to="/current">
            <div>{{ $t('header.current') }}</div>
            <img src="@/assets/images/icon/go.png" alt="" />
          </RouterLink>
          <RouterLink class="mobile-tab" @click="isMobileHeader = false" to="/history">
            <div>{{ $t('header.history') }}</div>
            <img src="@/assets/images/icon/go.png" alt="" />
          </RouterLink>
        </div>
        <div class="lang-group">
          <div
            class="lang"
            :class="{ 'lang-selected': selectedLanguage == item.value }"
            v-for="(item, index) in languages"
            :key="index"
            @click="changeLanguage(item.value)"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  height: 99px;
  background-color: $blue-bg;
  border-bottom: 1px solid $white;
  padding: 20px 3%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  @include pad() {
    height: 69px;
    border-bottom: 1px solid #e3e3e3;
  }

  .logo {
    img {
      cursor: pointer;
      height: 50px;
      @include pad() {
        height: 29px;
      }
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
    position: relative;
    .tab {
      @include text3;
      text-decoration: none;
      color: $gray2;
      height: 43px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;

      &:hover {
        color: $secondary;
      }
    }
    .current-tab {
      width: 96px;
    }
    .history-tab {
      width: 132px;
    }
    .active {
      color: $white;
    }
    .en-width {
      width: 132px;
    }

    .tab-indicator {
      position: absolute;
      bottom: 8px;
      left: 10px;
      height: 43px;
      width: 96px;
      background-color: $black;
      border-radius: 16px;
      transition: all 0.25s ease-out;
      z-index: 1;

      &.en-width {
        width: 132px;
      }
    }
    .history-tab-select {
      left: 138px;
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

<style lang="scss">
.nav-dialog {
  background: $primary !important;
  .el-drawer__close-btn {
    .el-icon {
      color: $white;
    }
  }
  .dialog-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 20px 5px;

    .mobile-tab-group {
      margin-top: 50px;
      .mobile-tab {
        font-size: 18px;
        color: $white;
        display: flex;
        justify-content: left;
        align-items: center;
        margin-bottom: 24px;
        cursor: pointer;
        text-decoration: none;

        &:hover {
          color: $blue-light;
        }

        div {
          margin-right: 16px;
        }
      }
    }
    .lang-group {
      display: flex;
      align-items: center;
      gap: 8px;
      color: $secondary;

      .lang:first-child {
        display: flex;
        gap: 8px;
        &::after {
          content: '｜';
          display: block;
          color: $white;
        }
      }
      .lang-selected {
        color: $white;
      }
    }
  }
}
</style>
