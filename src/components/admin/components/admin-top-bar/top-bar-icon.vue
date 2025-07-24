<template>
  <el-icon class="icon" @click="clickCollapse">
    <component :is="icon" />
  </el-icon>
</template>

<script lang="ts" setup>
import { Expand, Fold } from '@element-plus/icons-vue';
import { computed } from 'vue';

const icon = computed(() => (props.collapse ? Expand : Fold));

const emits = defineEmits<{
  (e: 'updateCollapse'): void;
}>();
function clickCollapse() {
  emits('updateCollapse');
}

interface Props {
  collapse?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapse: false,
});
</script>

<style lang="less" scoped>
.icon {
  width: 42px;
  height: 100%;
  cursor: pointer;

  &:hover {
    background-color: #e3e5e9;
  }
}
</style>
