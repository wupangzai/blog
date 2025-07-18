<template>
  <div class="is-top-label">{{ props.label }}</div>
</template>

<script lang="ts" setup>
interface Props {
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '置顶',
});
</script>

<style lang="less" scoped>
.is-top-label {
  width: 56px;
  height: 28px;
  border-radius: 9999px;
  border: 2px solid #fff;
  background-color: #f05252;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}
</style>
