<template>
  <div class="article">
    <article-header :article-detail="articleDetail" />
    <div class="article-content-container">
      <div class="article-detail">
        <md-preview
          :model-value="articleDetail.content"
          :code-foldable="false"
          preview-theme="cyanosis"
          :theme="theme as Themes"
          @get-catalog="getCatalog"
        />
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
        <article-toc class="article-top" :article-detail="articleDetail" :catalog="catalog" />
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
import { MdPreview } from 'md-editor-v3';
import type { Themes } from 'md-editor-v3';
import { useStates } from '@/hooks';

const { theme } = useStates(['theme']);

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

interface Catalog {
  id: string;
  text: string;
  level: number;
  line: number;
  top?: number;
}
const catalog = ref<Catalog[]>([]);
function getCatalog(mdCatalog: any[]) {
  catalog.value = mdCatalog;
}

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
    background-color: var(--custom-article-bg-color);
    display: flex;
    flex-direction: column;
    gap: 10px;
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
