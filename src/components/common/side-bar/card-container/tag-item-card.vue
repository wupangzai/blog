<template>
  <div class="tag-item-card" :class="labelTypeClass">
    <div class="tag-name">
      <span v-if="props.isWithPrefix">#</span>
      <span>{{ props.item.name }}</span>
    </div>
    <div v-if="!props.isLabelType" class="tag-count">{{ props.item.articlesTotal }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { TagsCardType } from '@/api/types';

interface Props {
  item: TagsCardType.TagListItem;
  isLabelType: boolean;
  isWithPrefix?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLabelType: false,
  isWithPrefix: false,
});

const labelTypeClass = computed(() => {
  return props.isLabelType ? 'is-label-type' : '';
});
</script>

<style lang="less" scoped>
.tag-item-card {
  height: 30px;
  padding: 6px 12px;
  display: flex;
  border-radius: 8px;
  border: 1px solid var(--el-color-info-light-7);
  font-size: 12px;
  align-items: center;
  cursor: pointer;

  .tag-name {
    color: var(--el-color-info);
    padding-right: 5px;
  }

  .tag-count {
    color: rgb(7, 89, 133);
    background-color: #bae6fd;
    padding: 2px 5px;
    border-radius: 50%;
    font-weight: 600;
  }

  &:hover {
    background-color: #e5e7eb;
  }
}

.tag-item-card.is-label-type {
  .tag-name {
    color: #03543f;
  }
  background-color: #def7ec;

  &:hover {
    background-color: #bcf0da;
  }
}
</style>
