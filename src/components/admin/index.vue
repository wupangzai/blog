<template>
  <div class="admin">
    <admin-menu class="admin-menu-layout" ref="adminMenuRef" />
    <admin-top-bar :collapse="adminMenuRef?.collapse">
      <template #icon>
        <top-bar-icon :collapse="adminMenuRef?.collapse" @update-collapse="updateCollapse" />
      </template>
      <template #action-btns>
        <top-bar-action-btns />
      </template>
    </admin-top-bar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import adminMenu from '@/components/admin/components/admin-menu/index.vue';
import adminTopBar from '@/components/admin/components/admin-top-bar/index.vue';
import topBarIcon from './components/admin-top-bar/top-bar-icon.vue';
import topBarActionBtns from './components/admin-top-bar/top-bar-action-btns.vue';

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

  :deep(.admin-menu-layout) {
    position: sticky;
    left: 0;
    top: 0;
    height: 100vh;
  }
}
</style>
