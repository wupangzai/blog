<template>
  <el-form-item class="table-form-item">
    <div class="form-item-content">
      <span class="label">{{ props.tableFormItem.label }}</span>
      <component
        :is="getFormItemComponentType"
        v-model="modelValue"
        v-bind="{ ...props.tableFormItem }"
      />
    </div>
  </el-form-item>
</template>

<script lang="ts" setup>
import type { SearchListItem } from '@/components/common/table-with-search/const';
import { ElInput, ElDatePicker } from 'element-plus';

import { computed } from 'vue';

interface Props {
  tableFormItem: SearchListItem;
}

const props = defineProps<Props>();

const modelValue = defineModel<SearchListItem['value']>();

const getFormItemComponentType = computed(() => {
  switch (props.tableFormItem.componentKey) {
    case 'input':
      return ElInput;
    case 'date-picker':
      return ElDatePicker;
    default:
      return void 0;
  }
});
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
