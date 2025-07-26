<template>
  <div class="admin-category">
    <table-with-search
      class="table-class"
      ref="tableRef"
      v-model="searchList"
      @search="getAdminCategoryList"
      :table-data="adminCategoryList"
      :table-column="tableColumn"
      :total="tableTotalCount"
    >
      <template #table-header>
        <el-button :icon="Plus" type="primary" @click="addCategoryFn">新增</el-button>
      </template>

      <template #default="{ row, column, index }">
        <span v-if="column.property === 'index'">{{ index + 1 }}</span>

        <el-button
          v-if="column.property === 'operations'"
          type="danger"
          size="small"
          :icon="Delete"
          @click="operateTableActions('delete', row.id)"
        >
          删除
        </el-button>
      </template>
    </table-with-search>
  </div>
</template>

<script lang="ts" setup>
import API from '@/api';
import type { AdminCategoryType } from '@/api/types';
import tableWithSearch from '@/components/common/table-with-search/index.vue';
import { ref } from 'vue';
import dayjs from 'dayjs';
import { Plus, Delete } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import addCategory from './add-category.vue';
import { useDialog } from '@/hooks';
const tableRef = ref<InstanceType<typeof tableWithSearch> | null>(null);

const searchList = ref([
  {
    prop: 'name',
    label: '分类名称',
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
    prop: 'name',
    label: '分类名称',
    width: '200px',
  },
  {
    prop: 'articlesTotal',
    label: '文章数',
    width: '100px',
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: '200px',
  },

  {
    prop: 'operations',
    label: '操作',
  },
];

const tableTotalCount = ref(0);
const adminCategoryList = ref<AdminCategoryType.AdminCategoryListItem[]>([]);

async function getAdminCategoryList(payload?: any) {
  const params = { ...payload };
  if (payload.createTime.length !== 0) {
    params.startDate = dayjs(payload.createTime[0]).format('YYYY-MM-DD');
    params.endDate = dayjs(payload.createTime[1]).format('YYYY-MM-DD');
  }
  const res = await API.AdminCategory.getAdminCategoryList(params);
  if (res) {
    adminCategoryList.value = res.data;
    tableTotalCount.value = res.total;
  }
}

function refreshTable() {
  tableRef.value?.search();
}

async function operateTableActions(actionType: string, id: number) {
  if (actionType === 'delete') {
    const success = (await API.AdminCategory.deleteCategory(id))?.success;

    if (success) {
      ElNotification({
        message: '删除成功',
        type: 'success',
      });
      refreshTable();
    }
  }
}

async function addCategoryFn() {
  const categoryValue = await useDialog({
    content: addCategory,
    dialogProps: {
      title: '添加文章分类',
      width: '650',
      showClose: true,
    },
  });

  const success = (await API.AdminCategory.addCategory(categoryValue))?.data;

  if (success) {
    ElNotification({
      message: '添加成功',
      type: 'success',
    });
    refreshTable();
  }
}
</script>

<style lang="less" scoped>
.admin-category {
  padding: 20px !important;

  .table-class {
    height: 90%;
  }
}
</style>
