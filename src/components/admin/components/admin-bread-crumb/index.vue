<template>
  <div class="admin-bread-crumb">
    <admin-bread-crumb-item
      v-for="item in adminBreadCrumb"
      :key="item.name"
      :admin-bread-crumb-item="item"
      v-model="currentRouteName"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAdminBreadCrumb } from '@/hooks';
import adminBreadCrumbItem from './admin-bread-crumb-item.vue';

const adminBreadCrumb = useAdminBreadCrumb();

const route = useRoute();
const defaultRouteName = route.name as string;
const currentRouteName = ref(defaultRouteName);
</script>

<style lang="less" scoped>
.admin-bread-crumb {
  width: 100%;
  border: 1px solid #ccc;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 4px;
}
</style>
