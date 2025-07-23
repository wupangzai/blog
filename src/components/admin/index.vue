<template>
  <div class="admin">
    <admin-menu ref="adminMenuRef" />
    <el-button @click="fn">click</el-button>
  </div>
</template>

<script lang="ts" setup>
import adminMenu from '@/components/admin/components/admin-menu/index.vue';
import { ref } from 'vue';

const adminMenuRef = ref<InstanceType<typeof adminMenu> | null>(null);

function fn() {
  if (adminMenuRef.value) {
    adminMenuRef.value.changeCollapse();
  }
}
</script>

<style lang="less" scoped>
.admin {
  width: 100%;
  display: flex;
}
</style>
