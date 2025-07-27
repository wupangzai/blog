<template>
  <div class="admin-wiki">
    <table-with-search
      class="table-class"
      ref="tableRef"
      v-model="searchList"
      @search="getAdminWikiList"
      :table-data="adminWikiList"
      :table-column="tableColumn"
      :total="tableTotalCount"
    >
      <template #table-header>
        <el-button :icon="Plus" type="primary" @click="operateWiki">新增知识库</el-button>
      </template>
      <template #default="{ row, column, index }">
        <span v-if="column.property === 'index'">{{ index + 1 }}</span>

        <img class="img" v-if="column.property === 'cover'" :src="row.cover" alt="" />

        <el-switch
          v-if="column.property === 'isTop'"
          :model-value="row[column.property]"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          @change="(value: boolean) => operateTableActions(column.property, row.id, value)"
        />

        <el-switch
          v-if="column.property === 'isPublish'"
          :model-value="row[column.property]"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          @change="(value: boolean) => operateTableActions(column.property, row.id, value)"
        />

        <div class="table-operations" v-if="column.property === 'operations'">
          <circle-icon
            v-for="(iconItem, index) in tableActionList"
            :key="index"
            :icon="iconItem.icon"
            @click="iconItem.callback(iconItem.icon, row.id, true, row)"
          />
        </div>
      </template>
    </table-with-search>
  </div>
</template>

<script lang="ts" setup>
import API from '@/api';
import type { AdminWikiType } from '@/api/types';
import tableWithSearch from '@/components/common/table-with-search/index.vue';
import { ref } from 'vue';
import { Close, Check, Plus } from '@element-plus/icons-vue';
import circleIcon from '@/components/admin/components/admin-article/circle-icon.vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useDialog, useDoubleConifrm } from '@/hooks';
import addWikiComponent from '@/components/admin/components/admin-wiki/add-wiki/index.vue';

const searchList = ref([
  {
    prop: 'title',
    label: '知识库标题',
    componentKey: 'input',
    value: '',
  },
  {
    prop: 'createTime',
    label: '创建时间',
    componentKey: 'date-picker',
    value: [],
    type: 'daterange',
    rangeSeparator: '至',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    default: [],
  },
]);

const tableColumn = [
  {
    prop: 'index',
    label: '序号',
    width: '100px',
  },
  {
    prop: 'title',
    label: '标题',
  },
  {
    prop: 'cover',
    label: '封面',
  },
  {
    prop: 'isTop',
    label: '是否置顶',
    width: '100px',
  },
  {
    prop: 'createTime',
    label: '发布时间',
  },
  {
    prop: 'isPublish',
    label: '是否发布',
    width: '100px',
  },
  {
    prop: 'operations',
    label: '操作',
  },
];

const tableActionList = ref([
  {
    icon: 'edit',
    callback: operateTableActions,
  },
  {
    icon: 'toc',
    callback: operateTableActions,
  },
  {
    icon: 'view',
    callback: operateTableActions,
  },
  {
    icon: 'delete',
    callback: operateTableActions,
  },
]);

const router = useRouter();
const tableRef = ref<InstanceType<typeof tableWithSearch> | null>(null);

async function operateWiki(type: string, initValue: any = {}) {
  const title = type === 'add' ? '新增知识库' : '编辑知识库';
  const resolveValue = await useDialog({
    content: addWikiComponent,
    slotProps: {
      initValue: initValue,
    },
    dialogProps: {
      title,
      width: '650',
      showClose: true,
    },
  });

  const addResult = await API.AdminWiki.addAdminWiki(resolveValue);

  if (addResult?.success) {
    ElNotification({
      message: '添加成功',
      type: 'success',
    });
    tableRef.value?.search();
  }
}
async function operateTableActions(actionType: string, id: number, toggleOption = true, row?: any) {
  if (actionType === 'add') {
    operateWiki(actionType);
    return;
  }

  if (actionType === 'edit') {
    operateWiki(actionType, row);
    return;
  }

  if (actionType === 'toc') {
  }

  if (actionType === 'view') {
    router.push({
      name: 'WikiDetail',
      params: {
        id,
      },
      query: {
        articleId: row.firstArticleId,
      },
    });
    return;
  }

  if (actionType === 'delete') {
    await useDoubleConifrm({ content: '是否确定要删除该文章？' });

    const success = (await API.AdminWiki.deleteArticle(id))?.success;
    if (success) {
      ElNotification({
        message: '删除成功',
        type: 'success',
      });
    }
  }

  if (actionType === 'isTop') {
    const success = (await API.AdminWiki.toggleIsTop(id, toggleOption))?.success;
    if (success) {
      ElNotification({
        message: '修改成功',
        type: 'success',
      });
    }
  }

  if (actionType === 'isPublish') {
    const success = (await API.AdminWiki.toggleIsPublish(id, toggleOption))?.success;
    if (success) {
      ElNotification({
        message: '修改成功',
        type: 'success',
      });
    }
  }

  tableRef.value?.search();
}

const adminWikiList = ref<AdminWikiType.AdminWikiListItem[]>([]);
const tableTotalCount = ref(0);
async function getAdminWikiList(payload?: any) {
  const params = { ...payload };
  if (payload.createTime.length !== 0) {
    params.startDate = dayjs(payload.createTime[0]).format('YYYY-MM-DD');
    params.endDate = dayjs(payload.createTime[1]).format('YYYY-MM-DD');
  }
  const res = await API.AdminWiki.getAdminWikiList(params);
  if (res) {
    adminWikiList.value = res.data;
    tableTotalCount.value = res.total;
  }
}
</script>

<style lang="less" scoped>
.admin-wiki {
  padding: 20px !important;

  .table-class {
    height: 90%;

    img {
      width: 100px;
      height: 54px;
    }

    .table-operations {
      display: flex;
      gap: 6px;
    }
  }
}
</style>
