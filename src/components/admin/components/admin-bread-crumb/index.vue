<template>
  <div class="admin-bread-crumb">
    <admin-bread-crumb-item
      v-for="item in adminBreadCrumb"
      :key="item.name"
      :admin-bread-crumb-item="item"
      v-model="currentRouteName"
      @remove-bread-crumb-item="removeBreadCrumbItem"
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

function removeBreadCrumbItem(routeName: string) {
  adminBreadCrumb.value = adminBreadCrumb.value.filter((item) => item.name !== routeName);
}
</script>

<style lang="less" scoped>
.admin-bread-crumb {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 4px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
</style>
