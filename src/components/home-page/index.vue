<template>
  <div class="home-page">
    <notice-board :noticeHtml="noticeHtml" />
  </div>
</template>

<script lang="ts" setup>
import API from '@/api';
import { onMounted, ref } from 'vue';
import NoticeBoard from '@/components/common/notice-board/index.vue';

const noticeHtml = ref('');
async function getNotice() {
  const res = await API.Notice.getNotice();
  if (res) {
    noticeHtml.value = res.content;
  }
}

onMounted(() => {
  getNotice();
});
</script>

<style lang="less" scoped></style>
