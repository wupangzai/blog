<template>
  <div class="admin-notice">
    <table-with-search
      class="table-class"
      ref="tableRef"
      v-model="searchList"
      @search="getAdminNoticeList"
      :table-data="adminNoticeList"
      :table-column="tableColumn"
      :total="tableTotalCount"
      :row-style="{ height: '50px' }"
    >
      <template #default="{ row, column, index }">
        <span v-if="column.property === 'index'">{{ index + 1 }}</span>

        <div
          v-if="column.property === 'content'"
          v-html="row[column.property]"
          class="table-content"
        ></div>

        <el-switch
          v-if="column.property === 'isShow'"
          inline-prompt
          :model-value="row[column.property]"
          :active-icon="Check"
          :inactive-icon="Close"
          @change="(value: boolean) => operateTableActions('changeIsShow', row.id, row)"
        >
        </el-switch>

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
import type { AdminNoticeType } from '@/api/types';
import tableWithSearch from '@/components/common/table-with-search/index.vue';
import { ref } from 'vue';
import dayjs from 'dayjs';
import { isShowOptionList } from './const';
import { useDialog, useDoubleConifrm } from '@/hooks';
import circleIcon from '@/components/admin/components/admin-article/circle-icon.vue';
import { ElNotification } from 'element-plus';
import { Close, Check } from '@element-plus/icons-vue';
import editNotice from './edit-notice.vue';

const tableRef = ref<InstanceType<typeof tableWithSearch> | null>(null);

const searchList = ref([
  {
    prop: 'content',
    label: '公告内容',
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
    prop: 'isShow',
    label: '是否展示',
    componentKey: 'select',
    value: '',
    options: isShowOptionList,
    placeholder: '请选择',
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
    prop: 'content',
    label: '公告名称',
  },
  {
    prop: 'isShow',
    label: '是否展示',
    width: '100px',
  },
  {
    prop: 'createTime',
    label: '发布时间',
    width: '200px',
  },

  {
    prop: 'operations',
    label: '操作',
    width: '200px',
  },
];

const tableActionList = ref([
  {
    icon: 'edit',
    tooltip: '编辑',
    callback: operateTableActions,
  },
  {
    icon: 'delete',
    tooltip: '删除',
    callback: operateTableActions,
  },
]);

async function operateTableActions(
  actionType: string,
  id: number,
  row?: AdminNoticeType.AdminNoticeListItem
) {
  if (actionType === 'changeIsShow') {
    const payload = {
      id,
      isShow: !row?.isShow,
    };
    const success = (await API.AdminNotice.updateIsShow(payload))?.success;

    if (success) {
      ElNotification({
        message: '修改成功',
        type: 'success',
      });
    }
  }

  if (actionType === 'edit') {
    const resolveValue = await useDialog({
      content: editNotice,
      slotProps: {
        noticeRow: row,
      },
      dialogProps: {
        title: '编辑公告',
        width: '650',
        showClose: true,
      },
    });
    const payload = {
      content: resolveValue,
      id,
    };
    const success = (await API.AdminNotice.updateNotice(payload))?.success;

    if (success) {
      ElNotification({
        message: '修改成功',
        type: 'success',
      });
    }
  }

  if (actionType === 'delete') {
    await useDoubleConifrm({ content: '是否确定要删除该公告？' });

    const success = (await API.AdminNotice.deleteNotice(id))?.success;
    if (success) {
      ElNotification({
        message: '删除成功',
        type: 'success',
      });
    }
  }

  tableRef.value?.search();
}

const adminNoticeList = ref<AdminNoticeType.AdminNoticeListItem[]>([]);
const tableTotalCount = ref(0);
async function getAdminNoticeList(payload: AdminNoticeType.AdminNoticeListApiPayload) {
  const params = { ...payload };
  if (payload?.createTime.length !== 0) {
    params.startDate = dayjs(payload?.createTime[0]).format('YYYY-MM-DD');
    params.endDate = dayjs(payload?.createTime[1]).format('YYYY-MM-DD');
  }
  const res = await API.AdminNotice.getAdminNoticeList(params);
  if (res) {
    adminNoticeList.value = res.data;
    tableTotalCount.value = res.total;
  }
}
</script>

<style lang="less" scoped>
.admin-notice {
  padding: 20px !important;

  .table-class {
    height: 90%;

    .table-content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      word-break: break-word;
      line-height: 20px;
      max-height: 70px;
    }

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
