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
  console.log('[ props.tableFormItem.componentKey ] >', props.tableFormItem.componentKey);
  switch (props.tableFormItem.componentKey) {
    case 'input':
      return 'el-input';
    case 'date-picker':
      return 'el-date-picker';
    case 'select':
      return 'el-select';
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
