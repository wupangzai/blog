<template>
  <el-menu-item v-if="isMenuItem" :index="modelValue.index">
    <template #title>
      <div class="custom-menu-item">
        <div v-html="modelValue.title" class="item-class" v-if="!modelValue.editing"></div>
        <el-input v-else v-model="modelValue.title" />
        <div class="custom-menu-item-btns">
          <el-icon class="icon" @click="moveItem('up')" v-if="isShowItemUpIcon">
            <Top />
          </el-icon>
          <el-icon class="icon" @click="moveItem('down')" v-if="isShowItemdownIcon">
            <Bottom />
          </el-icon>
          <el-icon class="icon" @click="editmenuItem">
            <EditPen />
          </el-icon>
          <el-icon class="icon" @click="deleteMenuItem">
            <Delete />
          </el-icon>
        </div>
      </div>
    </template>
  </el-menu-item>

  <el-sub-menu v-else :index="modelValue.index">
    <template #title>
      <div
        class="custom-sub-menu-item-btns"
        @click="modelValue.editing && $event.stopPropagation()"
      >
        <div v-html="modelValue.title" v-if="!modelValue.editing" class="item-class"></div>
        <el-input v-else v-model="modelValue.title" />

        <el-dropdown ref="dropdown1" trigger="hover" class="sub-menu-drop-down">
          <el-icon class="sub-menu-icon">
            <MoreFilled />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click.stop="editSubmenu">
                <el-icon><EditPen /></el-icon>
                重命名
              </el-dropdown-item>
              <el-dropdown-item @click="addArticle">
                <el-icon><Plus /></el-icon>
                添加文章
              </el-dropdown-item>
              <el-dropdown-item v-if="modelValue.sort !== 1" @click="move('up')">
                <el-icon><Top /></el-icon>
                上移
              </el-dropdown-item>
              <el-dropdown-item v-if="modelValue.sort !== props.total" @click="move('down')">
                <el-icon><Bottom /></el-icon>
                下移
              </el-dropdown-item>
              <el-dropdown-item @click="deleteSubMenu">
                <el-icon>
                  <Delete />
                </el-icon>
                移出目录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
    <menu-item-component
      v-for="(subItem, index) in modelValue.children"
      :key="subItem.id"
      :menu-item="subItem"
      v-model="modelValue.children[index]"
      :total="props.total"
      @delete="emits('delete', subItem.id)"
      @move="(id, type) => emits('move', id, type)"
      @add-article="(id, resolveValue) => emits('addArticle', id, resolveValue)"
      @move-item="(id, type) => emits('moveItem', id, type)"
      :children-length="props.childrenLength"
    />
  </el-sub-menu>
</template>

<script lang="ts" setup>
import type { AdminWikiType } from '@/api/types';
import menuItemComponent from '@/components/admin/components/admin-wiki/edit-catelog-wiki/menu-item.vue';
import { computed, type Ref } from 'vue';
import { EditPen, Delete, MoreFilled, Plus, Top, Bottom } from '@element-plus/icons-vue';
import { useDialog, useDoubleConifrm } from '@/hooks';
import addArticleComponent from './add-article.vue';

interface Props {
  total: number;
  childrenLength: number;
}

const props = defineProps<Props>();

const modelValue = defineModel<AdminWikiType.AdminWikiCatelogItem>({ default: () => ({}) });

const isMenuItem = computed(() => !modelValue.value.children || modelValue.value.level !== 1);

function editmenuItem() {
  modelValue.value.editing = !modelValue.value.editing;
}

function editSubmenu(e: Event) {
  e.stopPropagation();
  modelValue.value.editing = !modelValue.value.editing;
}

async function deleteMenuItem() {
  await useDoubleConifrm({ content: '是否确定要从目录中移出该篇文章？' });
  emits('delete', modelValue.value.id);
}

async function deleteSubMenu() {
  await useDoubleConifrm({ content: '是否确定要移出该目录？' });
  emits('delete', modelValue.value.id);
}

function moveItem(type: MoveType) {
  emits('moveItem', modelValue.value.id, type);
}

const isShowItemUpIcon = computed(() => {
  return modelValue.value.sort !== 1;
});

const isShowItemdownIcon = computed(() => {
  return modelValue.value.sort !== props.childrenLength;
});

async function addArticle() {
  const resolveValue = (await useDialog({
    content: addArticleComponent,
    slotProps: {
      id: modelValue.value.id,
    },
    dialogProps: {
      title: '添加文章',
      width: '1080',
      showClose: true,
    },
  })) as Ref<AdminWikiType.AdminWikiCatelogItem[]>;

  emits('addArticle', modelValue.value.id, resolveValue.value);
}

type MoveType = 'up' | 'down';
function move(type: MoveType) {
  emits('move', modelValue.value.id, type);
}

const emits = defineEmits<{
  (e: 'delete', id: number): void;
  (e: 'move', id: number, type: MoveType): void;
  (e: 'addArticle', id: number, resolveValue: AdminWikiType.AdminWikiCatelogItem[]): void;
  (e: 'moveItem', id: number, type: MoveType): void;
}>();
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

.custom-menu-item {
  display: flex;
  width: 100%;
  justify-content: space-between;

  .custom-menu-item-btns {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon {
      width: 36px;
      height: 36px;
      padding: 8px;
      border-radius: 50%;

      &:hover {
        background-color: var(--el-color-info-light-7);
      }
    }
  }
}

:deep(.custom-sub-menu-item-btns) {
  display: flex;
  width: 100%;
  justify-content: space-between;

  .sub-menu-icon {
    rotate: (90deg);
    width: 36px;
    height: 36px;
    padding: 8px;
    border-radius: 50%;

    &:hover {
      background-color: var(--el-color-info-light-7);
    }
  }

  .sub-menu-drop-down {
    display: flex;
    justify-content: center;
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
