<template>
  <div class="wiki-container" data-aos="fade-up">
    <notice-board :noticeHtml="noticeHtml" />
    <div class="wiki-list-content">
      <wiki-card
        class="wiki-card-item"
        v-for="cardItem in wikiList"
        :key="cardItem.id"
        :card-item="cardItem"
        @click-card="clickCard"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import API from '@/api';
import NoticeBoard from '@/components/common/notice-board/index.vue';
import type { WikiType } from '@/api/types';
import { onMounted, ref } from 'vue';
import wikiCard from '@/components/common/wiki-card/index.vue';
import { useRouter } from 'vue-router';

const noticeHtml = ref('');
async function getNotice() {
  const res = await API.Notice.getNotice();
  if (res) {
    noticeHtml.value = res.data?.content;
  }
}

const wikiList = ref<WikiType.WikiListItem[]>([]);

async function getWikiList() {
  const res = await API.Wiki.getWikiList();
  if (res) {
    wikiList.value = res.data;
  }
}

const router = useRouter();
function clickCard(id: number, articleId: number) {
  router.push({
    name: 'WikiDetail',
    params: {
      id,
    },
    query: {
      articleId,
    },
  });
}

onMounted(() => {
  Promise.all([getNotice(), getWikiList()]);
});
</script>

<style lang="less" scoped>
.wiki-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  .wiki-list-content {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    .wiki-card-item {
      flex: 1 1 calc((100% - 48px) / 3); /* 3个一行，gap为24px × 2 = 48px */
      max-width: calc((100% - 48px) / 3);
    }
  }
}
</style>
