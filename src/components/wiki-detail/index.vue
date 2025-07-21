<template>
  <div class="wiki-detail">
    <div class="wiki-detail-content">
      <div class="content-nav">
        <wiki-nav :menu="wikiCatalogList" class="sticky-class" />
      </div>
      <div class="article-content-container">
        <article-header :article-detail="articleDetail" class="article-header" />
        <div class="article-content" v-html="articleDetail.content"></div>
        <last-edit :update-time="articleDetail.updateTime" />
      </div>
      <div class="article-toc">
        <article-toc class="sticky-class" :article-detail="articleDetail" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import type { WikiType, ArticleType } from '@/api/types';
import API from '@/api';
import APIConst from '@/api/default-const';
import { useRoute } from 'vue-router';
import wikiNav from '@/components/wiki-detail/wiki-nav/index.vue';
import articleHeader from '../article/article-header.vue';
import lastEdit from '@/components/article/last-edit/index.vue';
import articleToc from '@/components/article/article-toc/index.vue';

const route = useRoute();
const wikiCatalogList = ref<WikiType.CatalogListItem[]>([]);

async function getWikiCatalogList() {
  const id = Number(route.params.id);
  const res = await API.Wiki.getWikiCatalogList(id);
  if (res) {
    wikiCatalogList.value = res.data;
  }
}

const articleDetail = ref<ArticleType.ArticleDetailData>(
  APIConst.ArticleConst.defaultArticleDetailData()
);

async function getArticleDetail() {
  const res = await API.Article.getArticleDetail(Number(route.query.articleId));
  if (res) {
    articleDetail.value = res;
  }
}

onMounted(() => {
  getWikiCatalogList();
});

watch(
  () => route.query.articleId,
  () => {
    getArticleDetail();
  },
  {
    immediate: true,
  }
);
</script>

<style lang="less" scoped>
@import '../article/rich-html.less'; /* 或直接复制粘贴样式到 scoped 样式中 */

.wiki-detail {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 68px);
  background-color: var(--el-color-info-light-9);
  padding: 0 4% 0 8%;
  border-top: 1px solid var(--el-color-info-light-9);

  .wiki-detail-content {
    width: 100%;
    min-height: calc(100vh - 68px);

    background-color: #fff;
    display: flex;

    .content-nav {
      border: 1px solid var(--el-color-info-light-9);
      padding: 12px;
    }

    .article-content-container {
      flex: 1;
      :deep(.article-header) {
        justify-content: flex-start;
      }

      .article-content {
        padding: 8px 12px 8px 24px;
      }
    }
    .article-toc {
      width: 320px;
    }
  }

  .sticky-class {
    position: sticky;
    top: 84px;
    right: 0;
  }
}
</style>
