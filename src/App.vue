<template>
  <div class="app">
    <page-header></page-header>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/page-header/index.vue';
import { useActions } from '@/hooks';
import { onMounted } from 'vue';

const { 'commonModule/GETPROFILE_ACTION': getProfile_Action } = useActions([
  'commonModule/GETPROFILE_ACTION',
]);

onMounted(async () => {
  getProfile_Action();
});
</script>

<style lang="css" scoped>
.app {
  position: relative;
}
</style>
