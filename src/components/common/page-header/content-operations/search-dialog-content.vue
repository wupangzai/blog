<template>
  <div class="search-dialog-content">
    <search-dialog-header @close="close" @input-change="search" />

    <el-divider class="el-divider" />

    <template v-if="isNotEmpty">
      <page-article-list-card
        v-for="item in searchList"
        :key="item.id"
        :list-item="item"
        @click-card="clickCard"
      />
    </template>

    <el-empty v-else description="未查询到结果, 换个姿势搜索吧~" />

    <el-divider class="el-divider" />

    <search-dialog-footer />
  </div>
</template>

<script lang="ts" setup>
import searchDialogHeader from './search-dialog-header.vue';
import searchDialogFooter from './search-dialog-footer.vue';
import API from '@/api';
import type { ArticleType } from '@/api/types';
import { computed, ref } from 'vue';
import pageArticleListCard from '@/components/common/page-article-list-card/index.vue';
import { useRouter } from 'vue-router';

const page = {
  current: 1,
  size: 10,
};
const searchList = ref<ArticleType.ArticleSearchItem[]>([]);
const isNotEmpty = computed(() => searchList.value.length !== 0);

async function getSearchList(word: string) {
  if (!word) return;
  const res = await API.Article.searchArticle({ ...page, word });
  if (res?.data) {
    searchList.value = res.data;
  }
}

async function search(word: string) {
  getSearchList(word);
}

const router = useRouter();
function clickCard(id: number) {
  router.push({
    name: 'Article',
    params: {
      id,
    },
  });
  emits('update:visible', 'confirm');
}

const emits = defineEmits<{
  (e: 'update:visible', closeType: string): void;
}>();

function close() {
  emits('update:visible', 'cancel');
}
</script>

<style lang="less" scoped>
.search-dialog-content {
  width: 600px;

  :deep(.el-divider) {
    margin-left: -16px;
    margin-right: -16px;
    width: calc(100% + 32px);
  }
}
</style>
