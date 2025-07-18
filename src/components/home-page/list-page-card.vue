<template>
  <div class="list-page-card">
    <div class="cover-img">
      <img :src="props.pageCard.cover" alt="" />
    </div>
    <div class="page-description">
      <div class="tags">
        <tag-item-card
          v-for="tag in pageCard.tags"
          :key="tag.id"
          :is-label-type="true"
          :item="tag"
        />
      </div>
      <h2>
        <span>{{ props.pageCard.title }}</span>
      </h2>
      <p class="summary">{{ props.pageCard.summary }}</p>
      <div class="footer">
        <div v-for="(footer, index) in footerList" :key="index" class="footer-item">
          <img :src="footer.icon" />
          <span>{{ footer.data }}</span>
        </div>
      </div>
    </div>

    <is-top-label class="is-top-label" v-if="props.pageCard.isTop" />
  </div>
</template>

<script lang="ts" setup>
import type { ArticleType } from '@/api/types';
import tagItemCard from '../common/side-bar/card-container/tag-item-card.vue';
import calendarSvg from '@/assets/svg/calendar.svg';
import backFileSvg from '@/assets/svg/backFile.svg';
import isTopLabel from '@/components/common/is-top-label/index.vue';

interface Props {
  pageCard: ArticleType.ArticleItem;
}

const props = defineProps<Props>();

const footerList = [
  {
    icon: calendarSvg,
    data: props.pageCard.createDate,
  },
  {
    icon: backFileSvg,
    data: props.pageCard.category.name,
  },
];
</script>

<style lang="less" scoped>
.list-page-card {
  position: relative;
  max-width: 450px;
  border-radius: 8px;
  border: 1px solid var(--el-color-info-light-5);
  background-color: #fff;

  &:hover {
    cursor: pointer;
    transform: scale(1.03);
  }

  .cover-img {
    img {
      width: 100%;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      max-height: 192px;
    }
  }

  .page-description {
    padding: 20px;

    .tags {
      display: flex;
      gap: 10px;
    }

    .summary {
      color: var(--el-color-info);
    }
  }

  .footer {
    display: flex;
    gap: 18px;

    .footer-item {
      display: flex;
      gap: 10px;
      align-items: center;
      color: var(--el-color-info);
      font-size: 14px;
      img {
        width: 12px;
        height: 12px;
        opacity: 0.4;
      }
    }
  }

  .is-top-label {
    position: absolute;
    top: -8px;
    right: -8px;
  }
}
</style>
