<template>
  <div class="operation-search">
    <el-button :icon="Search" class="el-button no-hover" @click="search">
      <template #default>
        <div class="button-slot">
          <div class="button-text">{{ buttonText }}</div>
          <el-tag type="info" effect="plain" size="small">Ctrl K</el-tag>
        </div>
      </template>
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import { useDialog } from '@/hooks';
import searchDialogContent from './search-dialog-content.vue';

const buttonText = '搜索文章...';

async function search() {
  await useDialog({
    content: searchDialogContent,
    dialogProps: {
      width: '640',
      showClose: false,
      closeOnClickModal: false,
      footer: false,
      closeOnPressEscape: true,
    },
  });
}
</script>

<style lang="less" scoped>
.operation-search {
  :deep(.no-hover.el-button:hover),
  :deep(.no-hover.el-button:focus) {
    background-color: inherit !important;
    border: 1px solid var(--el-color-info-light-3);
    color: #94a3bf !important;
    box-shadow: none !important;
  }
  .el-button {
    height: 36px;
    width: 173px;
  }
  .button-slot {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .button-text {
      color: #94a3bf;
      margin-right: 12px;
    }
  }
}
</style>
