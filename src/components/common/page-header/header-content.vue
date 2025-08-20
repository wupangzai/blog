<template>
  <div class="header-content">
    <div class="content-left">
      <slot name="content-pic"></slot>
      <slot name="content-title"></slot>
    </div>
    <div>
      <slot name="content-btn"></slot>
    </div>
    <div>
      <slot name="content-right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.header-content {
  width: 100%;
  height: 100%;
  max-width: 1280px;
  padding: 0 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .content-left {
    display: flex;
    align-items: center;

    .content-title {
      font-weight: 600;
    }
  }
}
</style>

<style lang="less">
.content-left {
  & .content-title {
    font-weight: 600;
    font-size: 24px;
    color: var(--custom-header-color);
  }
}
</style>
