<template>
  <main>
    <TaiwanMap />
  </main>
</template>

<script>
    import TaiwanMap from '@/components/TaiwanMap.vue';

    export default {
        name: 'MainLayout',
        components: {
            TaiwanMap
        },
    };
    
</script>

<style lang="scss" scoped>
</style>