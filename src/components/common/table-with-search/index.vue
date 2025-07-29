<template>
  <div class="table-with-search">
    <div class="search-list">
      <el-form class="search-form">
        <table-form-item-component
          v-for="tableFormItem in modelValue"
          v-model="tableFormItem.value"
          :key="tableFormItem.prop"
          :table-form-item="tableFormItem"
          v-bind="$attrs"
        />
      </el-form>
      <div class="btn-group">
        <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
        <el-button :icon="RefreshRight" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="table-content">
      <div>
        <slot name="table-header"></slot>
      </div>
      <el-table :data="props.tableData" class="table-class" border stripe v-bind="$attrs">
        <el-table-column v-if="props.showSelection" type="selection" width="55" />

        <el-table-column
          v-for="tableItem in props.tableColumn"
          v-bind="{ ...tableItem }"
          :key="tableItem.prop"
          :prop="tableItem.prop"
          :label="tableItem.label"
          show-overflow-tooltip
        >
          <template #header="{ column }">
            <slot name="header" :column="column">
              <span>{{ column.label }}</span>
            </slot>
          </template>
          <template #default="{ row, column, $index }">
            <slot name="default" :row="row" :column="column" :index="$index">
              <span>{{ row[column.property] }}</span>
            </slot>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <span class="text">共 {{ total }} 条</span>
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          v-model:current-page="pages.current"
          :total="total"
          v-model:page-size="pages.size"
          @change="paginationChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { SearchListItem } from '@/components/common/table-with-search/const';
import tableFormItemComponent from './table-form-item.vue';
import { Search, RefreshRight } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';

interface Props {
  tableData: any[];
  tableColumn: any[];
  total: number;
  showSelection?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tableData: () => [],
  showSelection: false,
});

interface Pages {
  current: number;
  size: number;
}

const pages = ref<Pages>({
  current: 1,
  size: 10,
});

const modelValue = defineModel<SearchListItem[]>({ default: () => [] });
console.log('[ modelValue ] >', modelValue);

const emits = defineEmits<{
  (e: 'search', payload?: any): void;
}>();
function search() {
  console.log('[ 1 ] >');
  const pagesWithSearchParams = {
    ...Object.fromEntries(modelValue.value.map((item) => [item.prop, item.value])),
    ...pages.value,
  };
  emits('search', pagesWithSearchParams);
}
function reset() {
  modelValue.value.forEach((item) => {
    item.value = item.default || '';
  });
  search();
}

function paginationChange() {
  search();
}

onMounted(() => {
  search();
});

defineExpose({
  search,
});
</script>

<style lang="less" scoped>
.table-with-search {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .search-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 36px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;

    .search-form {
      max-width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
    }
  }

  .table-content {
    background-color: #fff;
    border-radius: 8px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 24px;
    gap: 20px;

    .table-class {
      height: 100%;
    }

    .pagination {
      .text {
        color: var(--el-color-info);
        font-size: 14px;
      }
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }
  }
}
</style>
