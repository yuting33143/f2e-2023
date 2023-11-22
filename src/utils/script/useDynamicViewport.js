// useDynamicViewport.js
import { onMounted, onBeforeUnmount } from 'vue';
import { debounce } from './debounce.js';

export function useDynamicViewport() {
  // 設置 --vh 變數
  const setVhProperty = () => {
    const vh = window.innerHeight * 0.01;
    console.log(vh);
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  /** 防抖 **/
  const debouncedSetVhProperty = debounce(setVhProperty, 300);

  /** orientationchange 事件在設備的橫向或縱向模式改變時觸發，避免 ”鍵盤彈出“ 或是 "轉向" 時，vh 變化不及時 **/
  onMounted(() => {
    setVhProperty();
    window.addEventListener('resize', debouncedSetVhProperty);
    window.addEventListener('orientationchange', debouncedSetVhProperty);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', debouncedSetVhProperty);
    window.removeEventListener('orientationchange', debouncedSetVhProperty);
  });
}

// 調用方式：
// 在 scss 中使用 --vh 變數
// 舉例：height: calc(var(--vh, 1vh) * 100 - 46px);
