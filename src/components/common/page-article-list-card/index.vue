<template>
  <div class="page-article-list-card" @click="clickCard">
    <div class="cover">
      <img :src="props.listItem.cover" alt="" />
    </div>
    <div class="description">
      <div class="title"><span v-html="props.listItem.title"></span></div>
      <div class="date">
        <img :src="calendarSvg" alt="" />
        <div class="date-text">{{ props.listItem.createDate }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TagsCardType } from '@/api/types';
import calendarSvg from '@/assets/svg/calendarwhite.svg';
interface Props {
  listItem: TagsCardType.CategoryArticleListItem;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'clickCard', id: number): void;
}>();

function clickCard() {
  emits('clickCard', props.listItem.id);
}
</script>

<style lang="less" scoped>
.page-article-list-card {
  width: 100%;
  padding: 12px;
  height: 74px;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    cursor: pointer;
    background-color: rgb(243 244 246);
  }

  .cover {
    img {
      border-radius: 8px;
      width: 96px;
      height: 48px;
    }
  }

  .description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    .title {
      font-size: 16px;
      font-weight: 400;
    }

    .date {
      display: flex;
      align-items: center;
      gap: 6px;
      img {
        width: 10px;
        height: 10px;
      }
      .date-text {
        font-size: 12px;
        color: var(--el-color-info);
      }
    }
  }
}
</style>
