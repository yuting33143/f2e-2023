import { ref, onMounted, onUnmounted, computed } from 'vue';
import { defineStore } from 'pinia';

export const useWindowSizeStore = defineStore('windowsize', () => {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  function updateSize() {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
    // console.log('Updated size:', width.value);
    // console.log(isPad.value);
  }

  onMounted(() => {
    window.addEventListener('resize', updateSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
  });
  return { width, height };
});
