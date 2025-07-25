<template>
  <el-form-item class="table-form-item">
    <div class="form-item-content">
      <span class="label">{{ props.tableFormItem.label }}</span>
      <el-input
        v-if="getFormItemComponentType('input')"
        v-model="modelValue"
        v-bind="{ ...props.tableFormItem }"
      />

      <el-date-picker
        v-if="getFormItemComponentType('date-picker')"
        v-model="modelValue"
        v-bind="{ ...props.tableFormItem }"
      />
    </div>
  </el-form-item>
</template>

<script lang="ts" setup>
import type { SearchListItem } from '@/components/common/table-with-search/const';

interface Props {
  tableFormItem: SearchListItem;
}

const props = defineProps<Props>();

function getFormItemComponentType(key: string) {
  return props.tableFormItem.componentKey === key;
}

const modelValue = defineModel<SearchListItem['value']>();
</script>

<style lang="less" scoped>
.table-form-item {
  margin-bottom: 0;

  .form-item-content {
    display: flex;
    // align-items: center;
    // justify-content: center;
    color: #606266;

    .label {
      min-width: 70px;
    }
  }
}
</style>
