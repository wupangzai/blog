<template>
  <el-menu class="wiki-nav" ref="menuRef">
    <menu-item
      v-for="nav in menuWithIndex"
      :key="nav.id"
      :item="nav"
      @update-active-index="updateActiveIndex"
    />
  </el-menu>
</template>

<script lang="ts" setup>
import type { WikiType } from '@/api/types';
import menuItem from '@/components/wiki-detail/wiki-nav/meun-item.vue';
import { computed, ref, nextTick } from 'vue';
import type { ElMenu } from 'element-plus';

interface Props {
  menu: WikiType.CatalogListItem[];
}
interface EhanceMenu extends InstanceType<typeof ElMenu> {
  updateActiveIndex: (index: string) => void;
}

const menuRef = ref<EhanceMenu | null>(null);
async function updateActiveIndex(index: string) {
  await nextTick();
  if (menuRef.value) {
    menuRef.value.updateActiveIndex(index);
  }
}

function handleIndex(menuList: WikiType.CatalogListItem[], parent = '1') {
  return menuList?.map((item, index) => {
    if (item.children && item.children?.length !== 0) {
      handleIndex(item.children, String(index + 1));
    }

    if (!item.children || item?.children?.length == 0) {
      item.index = `${parent}-${index + 1}`;
    }

    if (item.level === 1) {
      item.index = String(index + 1);
    }
    return item;
  });
}

const menuWithIndex = computed(() => {
  let menuCopy: WikiType.CatalogListItem[] = [];
  Object.assign(menuCopy, props.menu);
  return handleIndex(menuCopy);
});

const props = defineProps<Props>();
</script>

<style lang="less" scoped>
.wiki-nav {
  width: 250px;
}
</style>
