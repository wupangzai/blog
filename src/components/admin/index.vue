<template>
  <div class="admin">
    <admin-menu class="admin-menu-layout" ref="adminMenuRef" />
    <div class="admin-content">
      <admin-top-bar :collapse="adminMenuRef?.collapse">
        <template #icon>
          <top-bar-icon :collapse="adminMenuRef?.collapse" @update-collapse="updateCollapse" />
        </template>
        <template #action-btns>
          <top-bar-action-btns />
        </template>
      </admin-top-bar>
      <admin-bread-crumb />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import adminMenu from '@/components/admin/components/admin-menu/index.vue';
import adminTopBar from '@/components/admin/components/admin-top-bar/index.vue';
import topBarIcon from './components/admin-top-bar/top-bar-icon.vue';
import topBarActionBtns from '@/components/admin/components/admin-top-bar/top-bar-action-btns.vue';
import adminBreadCrumb from '@/components/admin/components/admin-bread-crumb/index.vue';

const adminMenuRef = ref<InstanceType<typeof adminMenu> | null>(null);
function updateCollapse() {
  if (adminMenuRef.value) {
    adminMenuRef.value.changeCollapse();
  }
}
</script>

<style lang="less" scoped>
.admin {
  width: 100%;
  display: flex;
  position: relative;

  .admin-content {
    flex: 1;
  }

  :deep(.admin-menu-layout) {
    position: sticky;
    left: 0;
    top: 0;
    height: 100vh;
  }
}
</style>
