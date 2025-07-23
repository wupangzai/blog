<template>
  <el-menu-item v-if="isMenuItem" :index="menuListItem.index" @click="clickMenuItem">
    <menu-icon :icon="menuListItem.icon" />
    <span>{{ menuListItem.label }}</span>
  </el-menu-item>

  <el-sub-menu v-else :index="menuListItem.index">
    <admin-menu-item
      v-for="(subItem, i) in menuListItem.children"
      :key="i"
      :menu-list-item="subItem"
      @update-active-index="emits('updateActiveIndex', $event)"
    />
    <template #title>
      <menu-icon :icon="menuListItem.icon" />
      <span>{{ menuListItem.label }}</span>
    </template>
  </el-sub-menu>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import adminMenuItem from '@/components/admin/components/admin-menu/admin-menu-item.vue';
import type { MenuListItem } from '@/components/admin/components/admin-menu/const';
import menuIcon from './menu-icon.vue';
import { useRoute, useRouter } from 'vue-router';

interface Props {
  menuListItem: MenuListItem;
}

const props = defineProps<Props>();

const isMenuItem = computed(() => !props.menuListItem.children);

const router = useRouter();
function clickMenuItem() {
  router.push({
    name: props.menuListItem.name,
  });
}

const emits = defineEmits<{
  (e: 'updateActiveIndex', index: string): void;
}>();

const route = useRoute();
watch(
  () => route.name,
  () => {
    if (route.name === props.menuListItem.name) {
      emits('updateActiveIndex', props.menuListItem.index!);
    }
  },
  { immediate: true }
);
</script>

<style lang="less" scoped></style>
