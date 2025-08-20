<template>
  <div class="app">
    <page-header v-if="isShowPageHeader"></page-header>
    <router-view :data-aos="routerViewAnimation"></router-view>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/page-header/index.vue';
import { useActions, useMutations } from '@/hooks';
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const { 'commonModule/GETPROFILE_ACTION': getProfile_Action } = useActions([
  'commonModule/GETPROFILE_ACTION',
]);

const { SET_THEME } = useMutations(['SET_THEME']);
SET_THEME('light');

const route = useRoute();
const isShowPageHeader = computed(() => route.meta.isShowPageHeader);
const routerViewAnimation = computed(() => (isShowPageHeader.value ? 'fade-up' : ''));

onMounted(async () => {
  getProfile_Action();
});

watch(
  () => route.path,
  () => {
    console.log('[ 1234 ] >', route.path.includes('admin'));
    if (route.path.includes('admin')) {
      SET_THEME('admin');
      return;
    }
    SET_THEME('light');
  }
);
</script>

<style lang="css" scoped>
.app {
  position: relative;
}
</style>
