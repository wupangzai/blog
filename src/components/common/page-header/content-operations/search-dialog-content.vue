<template>
  <div class="search-dialog-content">
    <search-dialog-header @close="close" />

    <el-divider class="el-divider" />

    <el-empty description="未查询到结果, 换个姿势搜索吧~" />

    <el-divider class="el-divider" />

    <search-dialog-footer />
  </div>
</template>

<script lang="ts" setup>
import searchDialogHeader from './search-dialog-header.vue';
import searchDialogFooter from './search-dialog-footer.vue';

const emits = defineEmits<{
  (e: 'update:visible', value: boolean, closeType: string): void;
}>();

function close() {
  emits('update:visible', false, 'close');
}
</script>

<style lang="less" scoped>
.search-dialog-content {
  width: 600px;

  :deep(.el-divider) {
    margin-left: -16px;
    margin-right: -16px;
    width: calc(100% + 32px);
  }
}
</style>
