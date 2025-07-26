<template>
  <div class="circle-icon-container" :class="iconDynamicClass">
    <el-icon class="circle-icon">
      <component :is="renderIcon" />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { Edit, View, Delete } from '@element-plus/icons-vue';
import { computed } from 'vue';

interface Props {
  icon: string;
}

const props = defineProps<Props>();

const renderIcon = computed(() => {
  switch (props.icon) {
    case 'edit':
      return Edit;

    case 'view':
      return View;

    case 'delete':
      return Delete;

    default:
      return void 0;
  }
});

const iconDynamicClass = computed(() => {
  return props.icon === 'delete' ? 'is-red' : '';
});
</script>

<style lang="less" scoped>
.circle-icon-container {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  border: 1px solid var(--el-color-info-light-7);
  cursor: pointer;

  &:hover {
    background-color: var(--el-color-info-light-7);
  }

  &.is-red {
    background-color: #f56c6c;
    .circle-icon {
      color: #fff;
    }

    &:hover {
      background-color: red;
    }
  }

  .circle-icon {
    margin: auto;
    width: 12px;
    height: 12px;
  }
}
</style>
