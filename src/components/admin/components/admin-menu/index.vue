<template>
  <div class="admin-menu">
    <div class="logo">
      <img :src="menulogo" />
    </div>
    <el-menu ref="menuRef" :collapse="collapse" class="custom-menu">
      <admin-menu-item
        v-for="(menuListItem, index) in menuList"
        :menu-list-item="menuListItem"
        :key="index"
        @update-active-index="updateActiveIndex"
      />
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, computed } from 'vue';
import { MenuList, addIndexToMenu } from '@/components/admin/components/admin-menu/const';
import adminMenuItem from '@/components/admin/components/admin-menu/admin-menu-item.vue';
import type { ElMenu } from 'element-plus';
import menuLogo from '@/assets/imgs/weblog-logo.png';
import menuLogoShrink from '@/assets/imgs/admin-logo-shrink.png';
interface EhanceMenu extends InstanceType<typeof ElMenu> {
  updateActiveIndex: (index: string) => void;
}

const menuList = ref(addIndexToMenu(MenuList));

const menuRef = ref<EhanceMenu | null>(null);
async function updateActiveIndex(index: string) {
  await nextTick();
  if (menuRef.value) {
    menuRef.value.updateActiveIndex(index);
  }
}

const collapse = ref(false);
function changeCollapse() {
  collapse.value = !collapse.value;
}

const menulogo = computed(() => (collapse.value ? menuLogoShrink : menuLogo));

defineExpose({
  changeCollapse,
});
</script>

<style lang="less" scoped>
.logo {
  background-color: #1e293b;
  display: flex;
  padding: 3px 0;

  img {
    height: 60px;
    margin: auto;
    transition: all 3s ease;
  }
}

.custom-menu {
  --el-menu-bg-color: #1e293b;
  --el-menu-text-color: #fff;
  --el-menu-hover-bg-color: #2c3647;
  --el-menu-active-bg-color: var(--el-color-primary);
  --el-menu-text-color: #fff;

  .el-menu-item.is-active {
    background-color: var(--el-color-primary);
    color: #fff;
  }
}

.custom-menu:not(.el-menu--collapse) {
  width: 250px;
}
</style>
