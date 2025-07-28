<template>
  <div class="admin-comment">
    <table-with-search
      class="table-class"
      ref="tableRef"
      v-model="searchList"
      @search="getAdminCommentList"
      :table-data="adminCommentList"
      :table-column="tableColumn"
      :total="tableTotalCount"
    >
      <template #default="{ row, column, index }">
        <span v-if="column.property === 'index'">{{ index + 1 }}</span>

        <el-link
          type="primary"
          v-if="column.property === 'routerUrl'"
          @click="operateTableActions('goArticlePage', row.id, row)"
        >
          {{ row[column.property] }}
        </el-link>

        <img class="img" v-if="column.property === 'avatar'" :src="row[column.property]" alt="" />

        <el-tag v-if="column.property === 'status'" :type="getTag(row[column.property]).tagType">
          {{ getTag(row[column.property]).label }}
        </el-tag>

        <div class="table-operations" v-if="column.property === 'operations'">
          <el-tooltip
            effect="dark"
            v-for="(iconItem, index) in tableActionList"
            :key="index"
            :content="iconItem.tooltip"
          >
            <circle-icon
              :icon="iconItem.icon"
              @click="iconItem.callback(iconItem.icon, row.id, row)"
            />
          </el-tooltip>
        </div>
      </template>
    </table-with-search>
  </div>
</template>

<script lang="ts" setup>
import API from '@/api';
import type { AdminCommentType } from '@/api/types';
import tableWithSearch from '@/components/common/table-with-search/index.vue';
import { ref } from 'vue';
import dayjs from 'dayjs';
import { getTag, statusOptionList } from './const';
import { ElNotification } from 'element-plus';
import circleIcon from '@/components/admin/components/admin-article/circle-icon.vue';
import { useDialog, useDoubleConifrm } from '@/hooks';
import { useRouter } from 'vue-router';
import commentDetail from './comment-detail.vue';

const tableRef = ref<InstanceType<typeof tableWithSearch> | null>(null);

const searchList = ref([
  {
    prop: 'routerUrl',
    label: '路由地址',
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
  {
    prop: 'status',
    label: '状态',
    labelWidth: '50',
    componentKey: 'select',
    value: '',
    options: statusOptionList,
    placeholder: '请选择审核状态',
    style: 'width: 150px',
  },
]);

const tableColumn = [
  {
    prop: 'index',
    label: '序号',
    width: '100px',
  },
  {
    prop: 'routerUrl',
    label: '路由名称',
  },
  {
    prop: 'avatar',
    label: '头像',
    width: '70px',
  },
  {
    prop: 'nickname',
    label: '昵称',
    width: '100px',
  },
  {
    prop: 'content',
    label: '评论内容',
  },
  {
    prop: 'createTime',
    label: '发布时间',
    width: '200px',
  },

  {
    prop: 'status',
    label: '状态',
    width: '100px',
  },

  {
    prop: 'operations',
    label: '操作',
  },
];

const tableActionList = ref([
  {
    icon: 'toc',
    tooltip: '详情',
    callback: operateTableActions,
  },
  {
    icon: 'delete',
    tooltip: '删除',
    callback: operateTableActions,
  },
]);

const router = useRouter();
async function operateTableActions(
  actionType: string,
  id: number,
  row?: AdminCommentType.AdminCommentListItem
) {
  if (actionType === 'goArticlePage') {
    router.push({ path: row!.routerUrl });
  }

  if (actionType === 'toc') {
    await useDialog({
      content: commentDetail,
      slotProps: {
        commentRow: row,
      },
      dialogProps: {
        title: '评论详情',
        width: '650',
        showClose: true,
      },
    });
    return;
  }

  if (actionType === 'delete') {
    await useDoubleConifrm({ content: '是否确定要该评论，以及其子评论？' });

    const success = (await API.AdminComment.deleteComment(id))?.success;
    if (success) {
      ElNotification({
        message: '删除成功',
        type: 'success',
      });
    }
  }

  tableRef.value?.search();
}

const adminCommentList = ref<AdminCommentType.AdminCommentListItem[]>([]);
const tableTotalCount = ref(0);
async function getAdminCommentList(payload: AdminCommentType.AdminComentListApiPayload) {
  const params = { ...payload };
  if (payload?.createTime.length !== 0) {
    params.startDate = dayjs(payload?.createTime[0]).format('YYYY-MM-DD');
    params.endDate = dayjs(payload?.createTime[1]).format('YYYY-MM-DD');
  }
  const res = await API.AdminComment.getAdminCommentList(params);
  if (res) {
    adminCommentList.value = res.data;
    tableTotalCount.value = res.total;
  }
}
</script>

<style lang="less" scoped>
.admin-comment {
  padding: 20px !important;

  .table-class {
    height: 90%;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .table-operations {
      display: flex;
      gap: 12px;
    }
  }
}
</style>
