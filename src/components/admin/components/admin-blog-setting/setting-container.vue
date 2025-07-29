<template>
  <div class="setting-container">
    <div class="setting-content">
      <div class="title">{{ props.title }}</div>
      <slot name="form"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title: string;
}

const props = defineProps<Props>();
</script>

<style lang="less" scoped>
.setting-container {
  position: relative;
  width: 100%;
  padding: 36px;
  background-color: #fff;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    width: calc(100% - 40px);
    transform: translateX(-50%);
    height: 1px;
    background-color: #dcdfe6;
  }

  .setting-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    .title {
      font-weight: 700;
      font-size: 16px;
      color: #303133;
    }
  }
}
</style>
