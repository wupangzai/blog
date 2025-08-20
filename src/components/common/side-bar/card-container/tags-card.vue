<template>
  <div class="tags-card" v-if="isShowCard">
    <div class="header">
      <div class="tag-info">
        <img :src="props.icon" alt="" />
        <h2 class="label">{{ props.label }}</h2>
      </div>
      <div class="arrow" @click="arrowClick">
        <el-icon :size="12"><ArrowRight /></el-icon>
      </div>
    </div>

    <div class="tags-content">
      <tag-item-card
        v-for="item in props.itemList"
        :key="item.id"
        :item="item"
        :is-label-type="isLabelType"
        @click-tag="clickTag"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
import tagItemCard from './tag-item-card.vue';
import type { TagsCardType } from '@/api/types';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Props {
  label: string;
  icon: string;
  itemList: TagsCardType.TagListItem[];
  type: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  icon: '',
  itemList: () => [],
  type: '',
});

const isLabelType = computed(() => {
  return props.type === 'label';
});

const emits = defineEmits<{
  (e: 'arrowClick', type: string): void;
}>();
function arrowClick() {
  emits('arrowClick', props.type);
}

const router = useRouter();
function clickTag(id: number, name: string) {
  router.push({
    path: `/${props.type}`,
    query: { id, name },
  });
}

const route = useRoute();
const isShowCard = computed(() => !(route.path === `/${props.type}`));
</script>

<style lang="less" scoped>
.tags-card {
  width: 288px;
  //   height: 280px;
  padding: 20px;
  background-color: var(--custom-notice-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-color-info-light-7);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .tag-info {
      display: flex;
      align-items: center;
      gap: 8px;
      img {
        width: 16px;
        height: 16px;
      }

      .label {
        font-size: 16px;
      }
    }

    .arrow {
      width: 27px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--custom-notice-bg-color);
      border-radius: 8px;
      color: #9ca3af;

      &:hover {
        cursor: pointer;
        background-color: var(--custom-notice-bg-color);
      }
    }
  }

  .tags-content {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
