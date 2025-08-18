<template>
  <div class="edit-catelog-wiki">
    <el-button :icon="Plus" type="primary" @click="addCatelog">添加目录</el-button>

    <el-menu class="custom-menu">
      <menu-item-component
        v-for="(item, index) in adminWikiCatelogList"
        :key="item.id"
        :menu-item="item"
        v-model="adminWikiCatelogList[index]"
        :total="adminWikiCatelogList.length"
        @delete="deleteMenuItem"
        @move="moveSubMenu"
        @add-article="AddArticleFn"
        @move-item="moveItem"
        :children-length="item.children.length || 0"
      />
    </el-menu>

    <div class="actions">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { AdminWikiType } from '@/api/types';
import { Plus } from '@element-plus/icons-vue';
import addCatelogComponent from '@/components/admin/components/admin-wiki/edit-catelog-wiki/add-catelog.vue';
import { useDialog } from '@/hooks';
import API from '@/api';
import { onMounted, ref, watchEffect } from 'vue';
import { ElNotification } from 'element-plus';
import { addIndexToMenu } from '../../admin-menu/const';
import menuItemComponent from '@/components/admin/components/admin-wiki/edit-catelog-wiki/menu-item.vue';
import {
  removeItemByIdFromChildren,
  moveItemByIdFromChildren,
  addItemsToChildrenById,
  moveItemByIdInChildren,
} from './utils';

interface Props {
  wikiItem: AdminWikiType.AdminWikiListItem;
}

const props = defineProps<Props>();

let id = ref(0);

const adminWikiCatelogList = ref<AdminWikiType.AdminWikiCatelogItem[]>([]);

async function getAdminCategoryList() {
  const res = await API.AdminWiki.getAdminWikiCatelogList(props.wikiItem.id);

  if (res) {
    adminWikiCatelogList.value = addIndexToMenu<any>(res.data);
  }
}

async function addCatelog() {
  const resolveValue = await useDialog({
    content: addCatelogComponent,
    slotProps: {
      id: props.wikiItem.id,
    },
    dialogProps: {
      title: '添加目录',
      width: '650',
      showClose: true,
    },
  });

  id.value = id.value - 1;

  const newWikiItem = {
    articleId: null,
    children: [],
    editing: false,
    id: id.value,
    level: 1,
    sort: adminWikiCatelogList.value.length + 1,
    title: resolveValue,
  };

  const payload = {
    catalogs: [...adminWikiCatelogList.value, newWikiItem],
    id: props.wikiItem.id,
  };

  const res = await API.AdminWiki.updateAdminWikiCatelog(payload);
  if (res?.success) {
    ElNotification({
      message: '添加成功',
      type: 'success',
    });
    getAdminCategoryList();
  }
}

function deleteMenuItem(id: number) {
  adminWikiCatelogList.value = removeItemByIdFromChildren(adminWikiCatelogList.value, id);
}
type MoveType = 'up' | 'down';

function moveSubMenu(id: number, type: MoveType) {
  adminWikiCatelogList.value = moveItemByIdFromChildren(adminWikiCatelogList.value, id, type);
}

function AddArticleFn(_id: number, resolveValue: AdminWikiType.AdminWikiCatelogItem[]) {
  const listWithNewAttribute = resolveValue.map((item) => {
    id.value = id.value - 1;

    item.editing = false;
    item.articleId = item.id;
    item.id = id.value;
    item.children = [];
    return item;
  });

  adminWikiCatelogList.value = addItemsToChildrenById(
    adminWikiCatelogList.value,
    _id,
    listWithNewAttribute
  );
}

async function submit() {
  const payload = {
    catalogs: adminWikiCatelogList.value,
    id: props.wikiItem.id,
  };

  emits('update:visible', 'confirm', payload);
}

function moveItem(id: number, type: MoveType) {
  adminWikiCatelogList.value = moveItemByIdInChildren(adminWikiCatelogList.value, id, type);
}

const emits = defineEmits<{
  (
    e: 'update:visible',
    closeType: string,
    resolveValue?: AdminWikiType.addAdminWikiCatelogApiPayload
  ): void;
}>();

function close() {
  emits('update:visible', 'close');
}

watchEffect(() => {
  adminWikiCatelogList.value = addIndexToMenu<any>(adminWikiCatelogList.value);
});

onMounted(() => {
  getAdminCategoryList();
});
</script>

<style lang="less" scoped>
.edit-catelog-wiki {
  padding-top: 36px;

  .custom-menu {
    margin-top: 24px;

    :deep(.el-sub-menu__title) {
      padding-right: 20px;
    }
  }
  /* 1. 给标题 padding 留位置 */
  .custom-menu :deep(.el-sub-menu__title) {
    position: relative;
    padding-left: 20px; /* 左边空出箭头空间 */
  }

  /* 2. 将右边箭头移到左边 */
  .custom-menu :deep(.el-sub-menu__icon-arrow) {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 3px;
  }

  .actions {
    margin-top: 36px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
