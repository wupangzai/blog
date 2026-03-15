<template>
  <div class="home-page" data-aos="fade-up">
    <notice-board :noticeHtml="noticeHtml" />
    <side-bar class="mobile-side-bar" />
    <div class="page-container" ref="pageContainerRef">
      <list-page-card
        class="list-card"
        v-for="pageItem in articleList"
        :key="pageItem.id"
        :page-card="pageItem"
        @click="clickPageItem(pageItem.id)"
      />
    </div>
    <div class="pagination" v-if="page.total">
      <div class="total">共 {{ page.total }} 篇文章</div>
      <el-pagination
        background
        v-model:current-page="page.current"
        :layout="paginationLayout"
        :total="page.total"
        v-model:page-size="page.size"
        @change="() => getArticleList()"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import API from '@/api';
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import NoticeBoard from '@/components/common/notice-board/index.vue';
import type { ArticleType } from '@/api/types';
import listPageCard from './list-page-card.vue';
import { useRouter } from 'vue-router';
import sideBar from '@/components/common/side-bar/index.vue';

const noticeHtml = ref('');
async function getNotice() {
  const res = await API.Notice.getNotice();
  if (res) {
    noticeHtml.value = res.data?.content;
  }
}

const page = ref<ArticleType.Page>({
  current: 1,
  page: 1,
  total: 0,
  size: 10,
});

const articleList = ref<ArticleType.ArticleItem[]>([]);
const pageContainerRef = ref<HTMLElement | null>(null);

function scrollToFirstArticle() {
  const firstCard = pageContainerRef.value?.querySelector('.list-card') as HTMLElement | null;
  const target = firstCard ?? pageContainerRef.value;
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - 148;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: 'smooth',
  });
}

async function getArticleList(shouldScroll = true) {
  const res = await API.Article.getArticleList(page.value);
  if (res) {
    articleList.value = res.data;
    page.value = {
      current: res.current,
      page: res.page,
      size: page.value.size,
      total: res.total,
    };

    if (shouldScroll) {
      await nextTick();
      scrollToFirstArticle();
    }
  }
}

const router = useRouter();
function clickPageItem(id: number) {
  router.push({ name: 'Article', params: { id } });
}

const isMobile = ref(false);

function updateIsMobile() {
  isMobile.value = window.innerWidth <= 767;
}

const paginationLayout = computed(() =>
  isMobile.value ? 'prev, pager, next, jumper' : 'sizes, prev, pager, next, jumper'
);

onMounted(() => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
  getNotice();
  getArticleList(false);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile);
});
</script>

<style lang="less" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .mobile-side-bar {
    display: none;
  }

  .page-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;

    .list-card {
      flex: 1 1 calc(50% - 8px);
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;

    :deep(.el-pagination) {
      min-width: 0;
      flex-wrap: wrap;
      justify-content: center;
    }

    .total {
      color: var(--el-color-info);
      font-size: 14px;
      letter-spacing: 1px;
    }
  }
}

@media (max-width: 767px) {
  .home-page {
    gap: 16px;

    .mobile-side-bar {
      display: flex;
    }

    .page-container {
      gap: 12px;

      .list-card {
        flex-basis: 100%;
      }
    }

    .pagination {
      flex-wrap: wrap;
      gap: 8px;

      .total {
        width: 100%;
        text-align: center;
      }

      :deep(.el-pagination) {
        width: 100%;
        row-gap: 8px;
      }

      :deep(.el-pagination__sizes) {
        display: none;
      }

      :deep(.btn-prev),
      :deep(.btn-next) {
        min-width: 28px;
      }

      :deep(.el-pager) {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }

      :deep(.el-pagination__jump) {
        width: 100%;
        margin-left: 0;
        justify-content: center;
      }

      :deep(.el-pagination__editor) {
        min-width: 44px;
      }
    }
  }
}
</style>
