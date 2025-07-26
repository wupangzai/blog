<template>
  <div class="admin">
    <admin-menu class="admin-menu-layout" ref="adminMenuRef" />
    <div class="admin-right-container">
      <div class="admin-tools">
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
      <router-view v-slot="{ Component }" class="router-view">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import adminMenu from '@/components/admin/components/admin-menu/index.vue';
import adminTopBar from '@/components/admin/components/admin-top-bar/index.vue';
import topBarIcon from './components/admin-top-bar/top-bar-icon.vue';
import topBarActionBtns from '@/components/admin/components/admin-top-bar/top-bar-action-btns.vue';
import adminBreadCrumb from '@/components/admin/components/admin-bread-crumb/index.vue';
import { useActions } from '@/hooks';

const adminMenuRef = ref<InstanceType<typeof adminMenu> | null>(null);
function updateCollapse() {
  if (adminMenuRef.value) {
    adminMenuRef.value.changeCollapse();
  }
}

const { 'commonModule/GETADMINUSERINFO_ACTION': getAdminUserInfo } = useActions([
  'commonModule/GETADMINUSERINFO_ACTION',
]);

onMounted(() => {
  getAdminUserInfo();
});
</script>

<style lang="less" scoped>
.admin {
  width: 100%;
  display: flex;
  position: relative;
  height: 100vh;

  .admin-right-container {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;

    .admin-tools {
      background-color: #fff;
      z-index: 99;
      position: sticky;
      top: 0;
      left: 0;
    }
  }

  .router-view {
    flex: 1;
    padding: 36px;
    background-color: #f4f4f4;
    overflow: auto;
  }

  :deep(.admin-menu-layout) {
    position: sticky;
    left: 0;
    top: 0;
    height: 100vh;
  }
}
</style>
