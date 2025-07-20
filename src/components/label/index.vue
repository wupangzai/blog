<template>
  <div class="label-container" data-aos="fade-up">
    <div class="label">
      <tags-card :tag-list="tagsList" />
    </div>
    <div class="label-list-content" v-if="isShowListContent">
      <page-article-list-card
        class="list-card-line"
        v-for="listItem in tagsArticleList"
        :key="listItem.id"
        :list-item="listItem"
        @click-card="clickCard"
      />
    </div>
    <div class="pagination" v-if="page.total">
      <div class="total">共{{ page.total }}篇文章</div>
      <el-pagination
        v-model="page.current"
        background
        layout="prev, pager, next"
        :total="page.total"
        :page-size="page.size"
        @current-change="(current: number) => getTagsArticleList({ ...page, current })"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import API from '@/api';
import type { TagsCardType } from '@/api/types';
import tagsCard from '../common/page-tags-card/index.vue';
import { useRoute, useRouter } from 'vue-router';
import pageArticleListCard from '@/components/common/page-article-list-card/index.vue';

const tagsList = ref<TagsCardType.TagListItem[]>([]);
async function getlabelsTagList() {
  const res = await API.tagsCard.getTagList();
  if (res) {
    tagsList.value = res.data;
  }
}

const tagsArticleList = ref<TagsCardType.CategoryArticleListItem[]>([]);

const page = ref<TagsCardType.Page>({
  size: 10,
  current: 1,
  id: '',
  total: 0,
});

async function getTagsArticleList(pageParams: TagsCardType.Page) {
  const res = await API.tagsCard.getTagArticleList(pageParams);
  if (res) {
    tagsArticleList.value = res.data;
    page.value.current = res.current;
    page.value.total = res.total;
  }
}

const route = useRoute();
const router = useRouter();
function clickCard(id: number) {
  router.push({
    name: 'Article',
    params: {
      id,
    },
  });
}

const isShowListContent = computed(
  () => tagsArticleList.value && tagsArticleList.value.length !== 0
);

watch(
  () => route.query.id,
  () => {
    page.value.id = route.query.id as string;
    getlabelsTagList();
    getTagsArticleList(page.value);
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.label-container {
  display: flex;
  flex-direction: column;
}

.label {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid var(--el-color-info-light-7);
  padding: 10px 20px 28px 20px;

  gap: 12px;
  margin-bottom: 12px;
}

.label-list-content {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid var(--el-color-info-light-7);
  padding: 20px;

  .list-card-line {
    border-bottom: 1px solid var(--el-color-info-light-7);

    &:last-child {
      border-bottom: none;
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
