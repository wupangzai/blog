<template>
  <div class="notice-board">
    <img :src="noticeSvg" alt="" />
    <div v-html="noticeHtmlWithPrefix"></div>
    <el-icon><Close /></el-icon>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import noticeSvg from '@/assets/svg/notice.svg';
import { Close } from '@element-plus/icons-vue';

interface Props {
  noticeHtml: string;
}

const props = withDefaults(defineProps<Props>(), {
  noticeHtml: '',
});

const noticeHtmlWithPrefix = computed(() => {
  return '公告：' + props.noticeHtml;
});
</script>

<style lang="less" scoped>
.notice-board {
  padding: 16px;
  height: 72px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid var(--el-color-info-light-5);
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  & img {
    width: 16px;
    height: 16px;
  }

  :deep(a) {
    color: var(--el-color-primary); // 自定义颜色
    text-decoration: none;
  }
}
</style>
