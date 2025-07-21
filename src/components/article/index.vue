<template>
  <div class="article">
    <article-header :article-detail="articleDetail" />
    <div class="article-content-container">
      <div class="article-detail">
        <div class="article-content" v-html="articleDetail.content"></div>
        <last-edit :update-time="articleDetail.updateTime" />
        <div class="next-pre-control">
          <next-article
            v-for="(article, index) in controlActions"
            :key="index"
            :is-pre-article="article.isPreArticle"
            :article="article.acticle"
          />
        </div>
      </div>
      <div class="side-bar">
        <side-bar />
        <article-toc class="article-top" :article-detail="articleDetail" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import articleHeader from './article-header.vue';
import API from '@/api';
import type { ArticleType } from '@/api/types';
import { useRoute } from 'vue-router';
import APIConst from '@/api/default-const';
import sideBar from '@/components/common/side-bar/index.vue';
import articleToc from '@/components/article/article-toc/index.vue';
import lastEdit from '@/components/article/last-edit/index.vue';
import nextArticle from '@/components/article/next-article/index.vue';

const route = useRoute();
const articleDetail = ref<ArticleType.ArticleDetailData>(
  APIConst.ArticleConst.defaultArticleDetailData()
);
async function getArticleDetail() {
  const id = Number(route.params.id);
  const res = await API.Article.getArticleDetail(id);

  if (res) {
    articleDetail.value = res;
  }
}

const controlActions = computed(() => {
  return [
    {
      isPreArticle: true,
      acticle: articleDetail.value.preArticle,
    },
    {
      isPreArticle: false,
      acticle: articleDetail.value.nextArticle,
    },
  ];
});

const articleId = computed(() => route.params.id);

watch(
  () => articleId.value,
  () => {
    getArticleDetail();
  }
);

onMounted(() => {
  getArticleDetail();
});
</script>

<style lang="less" scoped>
@import './rich-html.less'; /* 或直接复制粘贴样式到 scoped 样式中 */

.article {
  width: 100%;
  background-color: var(--el-color-info-light-9);
  padding-top: 1px;

  .article-content-container {
    position: relative;
    display: flex;
    justify-content: center;

    padding: 16px 24px;
  }

  .article-detail {
    width: 917px;
    max-width: 917px;
    height: 100%;
    margin-right: 28px;
    border-radius: 8px;
    padding: 20px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .article-content {
    :deep(img) {
      max-width: 100%;
    }

    :deep(blockquote) {
      margin: 1.2em 0;
      padding: 0.8em 1em;
      border-left: 2px solid #3498db;
      background-color: #ecf0f1;
      color: #333;
      border-radius: 4px;
    }

    :deep(a) {
      color: var(--el-color-primary);
      text-decoration: none;
    }
  }

  .next-pre-control {
    display: flex;
    gap: 12px;
  }

  .side-bar {
    width: 290px;
    max-width: 290px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .article-top {
      position: sticky;
      top: 84px;
      right: 0;
    }
  }
}
</style>
