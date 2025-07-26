<template>
  <div class="admin-tag">
    <table-with-search
      class="table-class"
      ref="tableRef"
      v-model="searchList"
      @search="getAdminTagList"
      :table-data="adminTagList"
      :table-column="tableColumn"
      :total="tableTotalCount"
    >
      <template #table-header>
        <el-button :icon="Plus" type="primary" @click="addTag">新增</el-button>
      </template>

      <template #default="{ row, column, index }">
        <span v-if="column.property === 'index'">{{ index + 1 }}</span>

        <el-tag v-if="column.property === 'name'" type="success">{{ row[column.property] }}</el-tag>

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
import type { AdminTagType } from '@/api/types';
import tableWithSearch from '@/components/common/table-with-search/index.vue';
import { ref } from 'vue';
import dayjs from 'dayjs';
import { Plus, Delete } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { useDialog } from '@/hooks';
import addTagDialogContent from './add-tag-dialog-content.vue';
import { useDoubleConifrm } from '@/hooks';

const tableRef = ref<InstanceType<typeof tableWithSearch> | null>(null);

const searchList = ref([
  {
    prop: 'name',
    label: '标签名称',
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
    label: '标签名称',
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
const adminTagList = ref<AdminTagType.AdminTagListItem[]>([]);

async function getAdminTagList(payload?: any) {
  const params = { ...payload };
  if (payload.createTime.length !== 0) {
    params.startDate = dayjs(payload.createTime[0]).format('YYYY-MM-DD');
    params.endDate = dayjs(payload.createTime[1]).format('YYYY-MM-DD');
  }
  const res = await API.AdminTag.getAdminTagList(params);
  if (res) {
    adminTagList.value = res.data;
    tableTotalCount.value = res.total;
  }
}

function refreshTable() {
  tableRef.value?.search();
}

async function operateTableActions(actionType: string, id: number) {
  if (actionType === 'delete') {
    await useDoubleConifrm({ content: '是否确定要删除该标签？' });

    const success = (await API.AdminTag.deleteTag(id))?.success;

    if (success) {
      ElNotification({
        message: '删除成功',
        type: 'success',
      });
      refreshTable();
    }
  }
}

async function addTag() {
  const tagValue = await useDialog({
    content: addTagDialogContent,
    dialogProps: {
      title: '添加文章标签',
      width: '650',
      showClose: true,
    },
  });

  const success = (await API.AdminTag.addTag(tagValue))?.success;

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
.admin-tag {
  padding: 20px !important;

  .table-class {
    height: 90%;
  }
}
</style>
