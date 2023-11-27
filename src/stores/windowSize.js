import { ref, onBeforeMount, onBeforeUnmount } from 'vue';
import { defineStore } from 'pinia';

export const useWindowSizeStore = defineStore('windowsize', () => {
  const width = ref(0);
  const height = ref(0);

  function updateSize() {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  }

  // SSR 兼容性检查
  if (typeof window !== 'undefined') {
    onBeforeMount(() => {
      updateSize(); // 初始更新尺寸
      window.addEventListener('resize', updateSize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateSize);
    });
  }

  return { width, height };
});
