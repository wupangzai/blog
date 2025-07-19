<template>
  <div class="last-edit">
    <img :src="editSvg" />
    <div>最后编辑于</div>
    <div>{{ props.updateTime }}</div>
  </div>
</template>

<script lang="ts" setup>
import editSvg from '@/assets/svg/edit.svg';
interface Props {
  updateTime: string;
}

const props = withDefaults(defineProps<Props>(), {
  updateTime: '',
});
</script>

<style lang="less" scoped>
.last-edit {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--el-color-info);
  gap: 6px;

  img {
    width: 16px;
    height: 16px;
  }
}
</style>
