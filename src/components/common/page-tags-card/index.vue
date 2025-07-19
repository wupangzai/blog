<template>
  <div class="categories-tags-card">
    <div class="tag-info">
      <img :src="icon" alt="" />
      <h2 class="label">{{ title }}</h2>
      <div class="total-categories">{{ totalTags }}</div>
    </div>
    <div class="tags-content">
      <tag-item-card
        v-for="item in props.tagList"
        :key="item.id"
        :item="item"
        :class="getFoucsTagClass(item.id)"
        @click-tag="clickTag"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import categoriesSvg from '@/assets/svg/categories.svg';
import labelSvg from '@/assets/svg/label.svg';
import type { TagsCardType } from '@/api/types';
import tagItemCard from '@/components/common/side-bar/card-container/tag-item-card.vue';
import { useRoute, useRouter } from 'vue-router';

interface Props {
  tagList: TagsCardType.TagListItem[];
}

const props = withDefaults(defineProps<Props>(), {
  tagList: () => [],
});

const router = useRouter();
const route = useRoute();

const initialCurrentId = Number(route.query.id);
const currentId = ref<number>(initialCurrentId);
function clickTag(id: number, name: string) {
  currentId.value = id;
  router.push({
    path: route.path,
    query: {
      id,
      name,
    },
  });
}

function getFoucsTagClass(id: number) {
  return currentId.value === id && 'foucs-tag-class';
}

const totalTags = computed(() => `( ${props.tagList?.length} )`);

const title = computed(() => (route.path === '/categories' ? '分类' : '标签'));

const icon = computed(() => (route.path === '/categories' ? categoriesSvg : labelSvg));
</script>

<style lang="less" scoped>
.categories-tags-card {
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

    .label {
      font-size: 16px;
    }
    .total-categories {
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
