<template>
  <el-form class="edit-notice">
    <el-form-item label="分类名称" :required="input.required" :error="input.errMsg">
      <el-input
        v-model="input.value"
        placeholder="请输入分类名称"
        size="large"
        type="textarea"
        :rows="8"
      />
    </el-form-item>

    <el-form-item class="actions">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { Form, useRule } from '@/hooks/form-hooks';
import type { AdminNoticeType } from '@/api/types';

interface Props {
  noticeRow: AdminNoticeType.AdminNoticeListItem;
}

const props = defineProps<Props>();

const input = useRule(props.noticeRow.content);

const emits = defineEmits<{
  (e: 'update:visible', closeType: string, resolveValue?: string): void;
}>();

function close() {
  emits('update:visible', 'close');
}

async function submit() {
  const isValid = await Form.validateRules(input.value);
  if (isValid) {
    emits('update:visible', 'confirm', input.value.value);
  }
}
</script>

<style lang="less" scoped>
.edit-notice {
  padding-top: 36px;
  :deep(.actions .el-form-item__content) {
    width: 100%;
    display: flex;
    justify-content: end;
    margin-top: 36px;
  }
}
</style>
