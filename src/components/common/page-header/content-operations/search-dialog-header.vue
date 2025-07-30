<template>
  <div class="search-dialog-header">
    <el-input
      v-model="input"
      style="width: 95%"
      size="large"
      placeholder="请输入关键字搜索..."
      :prefix-icon="Search"
      @input="inputChange"
    />
    <el-icon size="18" @click="close" class="close-icon"><Close /></el-icon>
  </div>
</template>

<script lang="ts" setup>
import { Search, Close } from '@element-plus/icons-vue';
import { ref } from 'vue';
const input = ref('');

function inputChange(value: string) {
  emits('inputChange', value);
}

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'inputChange', word: string): void;
}>();

function close() {
  emits('close');
}
</script>

<style lang="less" scoped>
.search-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .close-icon {
    cursor: pointer;
  }
}
</style>
