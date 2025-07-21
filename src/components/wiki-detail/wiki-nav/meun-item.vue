<template>
  <el-menu-item v-if="isMenuItem" :index="props.item.index" @click="menuItemClick">
    <template #title>
      <div v-html="props.item.title" class="item-class"></div>
    </template>
  </el-menu-item>

  <el-sub-menu v-else :index="props.item.index">
    <template #title>
      <div v-html="props.item.title" class="item-class"></div>
    </template>
    <menu-item
      v-for="item in item.children"
      :item="item"
      :key="item.id"
      :parent-level="props.item.level"
      @update-active-index="emits('updateActiveIndex', $event)"
    />
  </el-sub-menu>
</template>

<script lang="ts" setup>
import type { WikiType } from '@/api/types';
import { computed, watch } from 'vue';
import menuItem from '@/components/wiki-detail/wiki-nav/meun-item.vue';
import { useRoute, useRouter } from 'vue-router';

interface Props {
  item: WikiType.CatalogListItem;
  parentLevel?: number;
}

const isMenuItem = computed(() => !props.item.children);

const props = defineProps<Props>();

const router = useRouter();
function menuItemClick() {
  if (props.item.articleId) {
    router.push({
      name: 'WikiDetail',
      query: {
        articleId: props.item.articleId,
      },
    });
  }
}

const emits = defineEmits<{
  (e: 'updateActiveIndex', index: string): void;
}>();

const route = useRoute();
watch(
  () => route.query.articleId,
  () => {
    if (route.query.articleId === String(props.item.articleId)) {
      emits('updateActiveIndex', props.item.index!);
    }
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
:deep(.el-sub-menu__title) {
  svg {
    width: 16px;
    height: 16px;
  }

  &:first-child {
    display: flex;
    align-items: center;
  }
}

:deep(.item-class) {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  svg {
    width: 20px !important;
    height: 20px !important;
  }
}
</style>
