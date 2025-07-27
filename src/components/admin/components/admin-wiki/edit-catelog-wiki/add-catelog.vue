<template>
  <el-form class="add-catelog">
    <el-form-item label="标题" :required="input.required" :error="input.errMsg">
      <el-input v-model="input.value" placeholder="请输入目录标题" size="large" />
    </el-form-item>

    <el-form-item class="actions">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { Form, useRule } from '@/hooks/form-hooks';

const input = useRule('');

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
.add-catelog {
  padding-top: 36px;
  :deep(.actions .el-form-item__content) {
    width: 100%;
    display: flex;
    justify-content: end;
    margin-top: 36px;
  }
}
</style>
