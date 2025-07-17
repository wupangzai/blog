<template>
  <div class="search-dialog-footer">
    <div class="footer-left">
      <el-tag type="info" effect="plain" size="small" class="tag">Esc</el-tag>
      <span>关闭</span>
    </div>
    <div class="footer-right">
      <span>基于 傲仔 学不腻开发</span>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.search-dialog-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--el-color-info-light-3);

  .tag {
    margin: 0 8px;
  }

  .footer-right {
  }
}
</style>
