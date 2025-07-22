<template>
  <div class="app">
    <page-header v-if="isShowPageHeader"></page-header>
    <router-view :data-aos="routerViewAnimation"></router-view>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/page-header/index.vue';
import { useActions } from '@/hooks';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const { 'commonModule/GETPROFILE_ACTION': getProfile_Action } = useActions([
  'commonModule/GETPROFILE_ACTION',
]);

const route = useRoute();
const isShowPageHeader = computed(() => route.meta.isShowPageHeader);
const routerViewAnimation = computed(() => (isShowPageHeader.value ? 'fade-up' : ''));

onMounted(async () => {
  getProfile_Action();
});
</script>

<style lang="css" scoped>
.app {
  position: relative;
}
</style>
