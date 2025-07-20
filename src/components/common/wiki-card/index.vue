<template>
  <div class="wiki-card">
    <div class="cover">
      <img :src="props.cardItem.cover" alt="" />
    </div>
    <div class="description">
      <h2>{{ props.cardItem.title }}</h2>
      <div class="summary">{{ props.cardItem.summary }}</div>
    </div>

    <is-top-label class="is-top-label" v-if="props.cardItem.isTop" />
  </div>
</template>

<script lang="ts" setup>
import type { WikiType } from '@/api/types';
import isTopLabel from '@/components/common/is-top-label/index.vue';

interface Props {
  cardItem: WikiType.WikiListItem;
}

const props = defineProps<Props>();
</script>

<style lang="less" scoped>
.wiki-card {
  position: relative;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--el-color-info-light-5);
  background-color: #fff;

  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }

  .cover {
    img {
      width: 286px;
      height: 144px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }

  .description {
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: center;
    gap: 8px;

    h2 {
      margin: 0;
    }

    .summary {
      font-size: 16px;
      color: rgb(107 114 128);
    }
  }

  .is-top-label {
    position: absolute;
    top: -8px;
    right: -8px;
  }
}
</style>
