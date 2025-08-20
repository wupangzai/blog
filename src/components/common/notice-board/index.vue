<template>
  <div class="notice-board" v-if="isShowNotice && props.noticeHtml">
    <img :src="noticeSvg" alt="" />
    <div v-html="noticeHtmlWithPrefix" class="notice-content"></div>
    <el-icon class="close-icon" @click="closeNotice"><Close /></el-icon>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
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

const isShowNotice = ref(true);
function closeNotice() {
  isShowNotice.value = false;
}
</script>

<style lang="less" scoped>
.notice-board {
  padding: 16px;
  height: 72px;
  background-color: var(--custom-notice-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-color-info-light-5);
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  flex-shrink: 0; /* 不允许收缩 */

  & img {
    width: 16px;
    height: 16px;
  }

  .notice-content {
    flex: 1;
  }

  .close-icon {
    cursor: pointer;
  }

  :deep(a) {
    color: var(--el-color-primary); // 自定义颜色
    text-decoration: none;
  }
}
</style>
