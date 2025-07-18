<template>
  <div class="home-page">
    <notice-board :noticeHtml="noticeHtml" />
    <div class="page-container">
      <list-page-card v-for="pageItem in articleList" :key="pageItem.id" :page-card="pageItem" />
    </div>
    <div class="pagination">
      <div class="text">共</div>
      <el-pagination v-bind="{ ...page }" layout="prev, pager, next" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import API from '@/api';
import { onMounted, ref } from 'vue';
import NoticeBoard from '@/components/common/notice-board/index.vue';
import type { ArticleType } from '@/api/types';
import listPageCard from './list-page-card.vue';

const noticeHtml = ref('');
async function getNotice() {
  const res = await API.Notice.getNotice();
  if (res) {
    noticeHtml.value = res.content;
  }
}

const page = ref({
  current: 1,
  page: 1,
  size: 10,
  total: 6,
});

const articleList = ref<ArticleType.ArticleList[]>([]);
async function getArticleList() {
  const res = await API.Article.getArticleList(page.value);
  if (res) {
    articleList.value = res;
  }
}

onMounted(() => {
  getNotice();
  getArticleList();
});
</script>

<style lang="less" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .page-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style>
