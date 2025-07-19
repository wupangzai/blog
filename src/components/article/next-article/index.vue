<template>
  <div class="next-article" v-if="props.article?.articleId" @click="goArticle">
    <div class="fix-content" :class="classOfNext">
      <el-icon>
        <component :is="fixContent.icon" />
      </el-icon>
      <div>{{ fixContent.text }}</div>
    </div>
    <div :class="classOfNext">
      {{ props.article.articleTitle }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Back, Right } from '@element-plus/icons-vue';
import { computed } from 'vue';
import type { ArticleType } from '@/api/types';
import { useRouter } from 'vue-router';

interface Props {
  isPreArticle?: boolean;
  article: ArticleType.NextOrPreArticle;
}

const fixContent = computed(() => {
  const isPreArticle = props.isPreArticle;
  return {
    icon: isPreArticle ? Back : Right,
    text: isPreArticle ? '上一篇' : '下一篇',
  };
});

const props = withDefaults(defineProps<Props>(), {
  isPreArticle: false,
  article: () => ({
    articleId: 0,
    articleTitle: '',
  }),
});

const classOfNext = computed(() => {
  return !props.isPreArticle && 'class-of-next';
});

const router = useRouter();
function goArticle() {
  router.push({ name: 'Article', params: { id: props.article.articleId } });
}
</script>

<style lang="less" scoped>
.next-article {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--el-color-info-light-5);
  height: 80px;
  padding: 16px;
  color: var(--el-color-info);
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    cursor: pointer;
    background-color: rgb(243 244 246);
  }
  .fix-content {
    display: flex;
    gap: 8px;
  }

  .class-of-next {
    display: flex;
    flex-direction: row-reverse;
    // justify-content: flex-end;
  }
}
</style>
