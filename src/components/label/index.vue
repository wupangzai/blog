<template>
  <div class="label">
    <tags-card :tag-list="tagsList" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import API from '@/api';
import type { TagsCardType } from '@/api/types';
import tagsCard from '../common/page-tags-card/index.vue';
import { useRoute } from 'vue-router';

const tagsList = ref<TagsCardType.TagListItem[]>([]);
async function getlabelsTagList() {
  const res = await API.tagsCard.getTagList();
  if (res) {
    tagsList.value = res.data;
  }
}

const route = useRoute();

watch(
  () => route.query.id,
  () => {
    getlabelsTagList();
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.label {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid var(--el-color-info-light-7);
  padding: 10px 20px 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .tag-info {
    display: flex;
    align-items: center;
    gap: 8px;
    img {
      width: 20px;
      height: 20px;
    }

    .label-text {
      font-size: 16px;
    }
    .total-label {
      color: var(--el-color-info);
    }
  }

  .tags-content {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .foucs-tag-class {
    background-color: #e0f2fe;
  }
}
</style>
