<template>
  <el-form-item
    class="table-form-item"
    :label-width="props.tableFormItem.labelWidth"
    :label="props.tableFormItem.label"
  >
    <div class="form-item-content">
      <component
        :is="getFormItemComponentType"
        v-model="modelValue"
        v-bind="{ ...props.tableFormItem }"
      >
        <template v-if="itemNeedCustom">
          <template v-if="props.tableFormItem.componentKey === 'select'">
            <el-option
              v-for="(option, index) in props.tableFormItem.options"
              :key="index"
              :value="option.value"
              :label="option.label"
            >
            </el-option>
          </template>
        </template>
      </component>
    </div>
  </el-form-item>
</template>

<script lang="ts" setup>
import type { SearchListItem } from '@/components/common/table-with-search/const';
import { ElInput, ElDatePicker, ElSelect, ElOption } from 'element-plus';

import { computed } from 'vue';

interface Props {
  tableFormItem: SearchListItem;
}

const props = defineProps<Props>();

const modelValue = defineModel<SearchListItem['value']>();

const customRenderList = ['select'];

const itemNeedCustom = computed(() => {
  return customRenderList.includes(props.tableFormItem.componentKey);
});

const getFormItemComponentType = computed(() => {
  switch (props.tableFormItem.componentKey) {
    case 'input':
      return ElInput;
    case 'date-picker':
      return ElDatePicker;
    case 'select':
      return ElSelect;
    default:
      return void 0;
  }
});

console.log('[ props.tableFormItem ] >', props.tableFormItem);
</script>

<style lang="less" scoped>
.table-form-item {
  margin-bottom: 0;

  .form-item-content {
    display: flex;
    color: #606266;
  }
}
</style>
