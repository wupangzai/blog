<template>
  <div class="achieve-container" data-aos="fade-up">
    <div class="achieve-content" v-for="(achieve, index) in achieveList" :key="index">
      <time class="title">{{ achieve.month }}</time>
      <div class="card-content">
        <page-article-list-card
          @click-card="clickCard"
          class="list-card-line"
          v-for="listItem in achieve.articles"
          :key="listItem.id"
          :list-item="listItem"
        />
      </div>
    </div>
    <div class="pagination" v-if="page.total">
      <div class="total">共{{ page.total }}篇文章</div>
      <el-pagination
        v-model="page.current"
        background
        layout="prev, pager, next"
        :total="page.total"
        :page-size="page.size"
        @current-change="(current: number) => getAchieveList({ ...page, current })"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import API from '@/api';
import type { AchieveType, ArticleType } from '@/api/types';
import pageArticleListCard from '@/components/common/page-article-list-card/index.vue';
import { useRouter } from 'vue-router';

const achieveList = ref<AchieveType.AchieveListItem[]>([]);
const page = ref<ArticleType.Page>({
  current: 1,
  size: 10,
  total: 0,
  page: 1,
});

async function getAchieveList(pageParams: ArticleType.Page) {
  const res = await API.Achieve.getAchieveList(pageParams);

  if (res) {
    achieveList.value = res.data;
    page.value.current = res.current;
    page.value.total = res.total;
  }
}
const router = useRouter();
function clickCard(id: number) {
  router.push({
    name: 'Article',
    params: {
      id,
    },
  });
}

onMounted(() => {
  getAchieveList(page.value);
});
</script>

<style lang="less" scoped>
.achieve-container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .achieve-content {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: var(--custom-notice-bg-color);
    border-radius: 8px;
    border: 1px solid var(--el-color-info-light-7);

    .title {
      font-weight: 600;
      font-size: 18px;
      line-height: 28px;
      color: var(--custom-header-color);
    }

    .card-content {
      padding: 12px 0;

      .list-card-line {
        border-bottom: 1px solid var(--el-color-info-light-7);

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  .total {
    color: var(--el-color-info);
    font-size: 14px;
    letter-spacing: 3px;
  }
}
</style>
