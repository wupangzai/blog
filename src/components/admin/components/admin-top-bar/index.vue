<template>
  <div class="admin-top-bar">
    <slot name="icon"></slot>

    <div class="action-btns">
      <slot name="action-btns"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.admin-top-bar {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .action-btns {
    width: 240px;
    height: 100%;
    display: flex;
  }
}
</style>
