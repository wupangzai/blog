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
      @selection-change="handleSelection"
      :show-selection="true"
    >
      <template #default="{ row, column, index }">
        <span v-if="column.property === 'index'">{{ index + 1 }}</span>

        <img class="img" v-if="column.property === 'cover'" :src="row.cover" alt="" />

        <el-switch
          v-if="column.property === 'isTop'"
          :model-value="row[column.property]"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          disabled
        />

        <el-switch
          v-if="column.property === 'isPublish'"
          :model-value="row[column.property]"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          disabled
        />
      </template>
    </table-with-search>
    <div class="actions">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import API from '@/api';
import type { AdminArticleType } from '@/api/types';
import tableWithSearch from '@/components/common/table-with-search/index.vue';
import { ref } from 'vue';
import { Close, Check } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

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
    width: '60px',
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
]);

const tableRef = ref<InstanceType<typeof tableWithSearch> | null>(null);

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

const selectedRows = ref<AdminArticleType.AdminArticleListItem[]>([]);
function handleSelection(row: AdminArticleType.AdminArticleListItem[]) {
  selectedRows.value = row;
}

async function submit() {
  emits('update:visible', 'confirm', selectedRows);
}

const emits = defineEmits<{
  (e: 'update:visible', closeType: string, resolveValue?: any): void;
}>();

function close() {
  emits('update:visible', 'close');
}
</script>

<style lang="less" scoped>
.admin-aricle {
  width: 100%;

  .table-class {
    height: 90%;

    img {
      width: 100px;
      height: 54px;
    }
  }
  .actions {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
