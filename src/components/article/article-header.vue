<template>
  <div class="article-header">
    <div class="header-content">
      <div class="tags">
        <tag-item-card
          v-for="tag in props.articleDetail.tags"
          :key="tag.id"
          :item="tag"
          :is-label-type="true"
          :is-with-prefix="true"
        />
      </div>

      <div class="title">
        <h1>{{ props.articleDetail.title }}</h1>
      </div>

      <div class="icon-group">
        <div class="group-item" v-for="(item, index) in keyToIconMapList" :key="index">
          <img :src="item.icon" alt="" />
          <div>{{ props.articleDetail[item.dataKey] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ArticleType } from '@/api/types';
import tagItemCard from '../common/side-bar/card-container/tag-item-card.vue';
import APIConst from '@/api/default-const';
import { keyToIconMapList } from '@/components/article/const';

interface Props {
  articleDetail: ArticleType.ArticleDetailData;
}

const props = withDefaults(defineProps<Props>(), {
  articleDetail: () => APIConst.ArticleConst.defaultArticleDetailData(),
});
</script>

<style lang="less" scoped>
.article-header {
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  .header-content {
    width: 75%;
    max-width: 1280px;
    min-height: 238px;
    padding: 40px 24px 56px 24px;

    .tags {
      display: flex;
      gap: 8px;
    }

    .title {
      h1 {
        font-size: 36px;
      }
      color: #4c4e4d;
      line-height: 40px;
      padding-bottom: 24px;
    }

    .icon-group {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }

    .group-item {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      gap: 5px;
      color: var(--el-color-info-light-3);

      img {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
