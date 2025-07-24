<template>
  <div class="admin-top-bar">
    <el-icon class="icon" @click="clickCollapse">
      <component :is="icon" />
    </el-icon>

    <div class="action-btns">
      <slot name="action-btns"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Expand, Fold } from '@element-plus/icons-vue';
import { computed } from 'vue';

interface Props {
  collapse?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapse: false,
});

const icon = computed(() => (props.collapse ? Expand : Fold));

const emits = defineEmits<{
  (e: 'updateCollapse'): void;
}>();
function clickCollapse() {
  emits('updateCollapse');
}
</script>

<style lang="less" scoped>
.admin-top-bar {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .icon {
    width: 42px;
    height: 100%;
    cursor: pointer;

    &:hover {
      background-color: #e3e5e9;
    }
  }

  .action-btns {
    width: 240px;
    height: 100%;
    display: flex;
  }
}
</style>
