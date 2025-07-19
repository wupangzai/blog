<template>
  <div class="home-page">
    <notice-board :noticeHtml="noticeHtml" />
    <div class="page-container">
      <list-page-card
        v-for="pageItem in articleList"
        :key="pageItem.id"
        :page-card="pageItem"
        @click="clickPageItem(pageItem.id)"
      />
    </div>
    <div class="pagination">
      <div class="total">共{{ page.total }}篇文章</div>
      <el-pagination
        background
        layout="prev, pager, next"
        hide-on-single-page
        :total="page.total"
        :page-size="page.size"
        @prev-click="getArticleList"
        @next-click="getArticleList"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import API from '@/api';
import { onMounted, ref } from 'vue';
import NoticeBoard from '@/components/common/notice-board/index.vue';
import type { ArticleType } from '@/api/types';
import listPageCard from './list-page-card.vue';
import { useRouter } from 'vue-router';

const noticeHtml = ref('');
async function getNotice() {
  const res = await API.Notice.getNotice();
  if (res) {
    noticeHtml.value = res.data.content;
  }
}

const page = ref({
  current: 1,
  page: 1,
  size: 10,
  total: 6,
});

const articleList = ref<ArticleType.ArticleItem[]>([]);
async function getArticleList(current = 1) {
  page.value.current = current;
  const res = await API.Article.getArticleList(page.value);
  if (res) {
    articleList.value = res.data;
    page.value = {
      current: res.current,
      page: res.page,
      size: res.size,
      total: res.total,
    };
  }
}

const router = useRouter();
function clickPageItem(id: number) {
  router.push({ name: 'Article', params: { id } });
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

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    .total {
      color: var(--el-color-info);
      font-size: 14px;
      letter-spacing: 3px;
    }
  }
}
</style>
