<template>
  <div class="admin-aricle">
    <table-with-search
      class="table-class"
      ref="tableRef"
      v-model="searchList"
      @search="getAdminArticleList"
      :table-data="adminArticleList"
      :table-column="tableColumn"
      :total="tableTotalCount"
    >
      <template #table-header>
        <el-button :icon="EditPen" type="primary">写文章</el-button>
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
            @click="iconItem.callback(iconItem.icon, row.id)"
          />
        </div>
      </template>
    </table-with-search>
  </div>
</template>

<script lang="ts" setup>
import API from '@/api';
import type { AdminArticleType } from '@/api/types';
import tableWithSearch from '@/components/common/table-with-search/index.vue';
import { ref } from 'vue';
import { Close, Check, EditPen } from '@element-plus/icons-vue';
import circleIcon from './circle-icon.vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';

const searchList = ref([
  {
    prop: 'title',
    label: '文章标题',
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

const tableColumn = ref([
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
]);

const tableActionList = ref([
  {
    icon: 'edit',
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
async function operateTableActions(actionType: string, id: number, toggleOption = true) {
  if (actionType === 'edit') {
    // todo
    return;
  }
  if (actionType === 'view') {
    router.push({
      name: 'Article',
      params: {
        id,
      },
    });
    return;
  }

  if (actionType === 'delete') {
    const success = (await API.AdminArticle.deleteArticle(id))?.success;
    if (success) {
      ElNotification({
        message: '删除成功',
        type: 'success',
      });
    }
  }

  if (actionType === 'isTop') {
    const success = (await API.AdminArticle.toggleIsTop(id, toggleOption))?.success;
    if (success) {
      ElNotification({
        message: '修改成功',
        type: 'success',
      });
    }
  }

  if (actionType === 'isPublish') {
    const success = (await API.AdminArticle.toggleIsPublish(id, toggleOption))?.success;
    if (success) {
      ElNotification({
        message: '修改成功',
        type: 'success',
      });
    }
  }

  tableRef.value?.search();
}

const adminArticleList = ref<AdminArticleType.AdminArticleListItem[]>([]);
const tableTotalCount = ref(0);
async function getAdminArticleList(payload?: any) {
  const params = { ...payload };
  if (payload.createTime.length !== 0) {
    params.startDate = dayjs(payload.createTime[0]).format('YYYY-MM-DD');
    params.endDate = dayjs(payload.createTime[1]).format('YYYY-MM-DD');
  }
  const res = await API.AdminArticle.getAdminArticleList(params);
  if (res) {
    adminArticleList.value = res.data;
    tableTotalCount.value = res.total;
  }
}
</script>

<style lang="less" scoped>
.admin-aricle {
  width: 100%;
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
