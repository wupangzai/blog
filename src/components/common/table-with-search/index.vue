<template>
  <div class="table-with-search">
    <div class="search-list">
      <el-form class="search-form">
        <table-form-item
          v-for="tableFormItem in modelValue"
          v-model="tableFormItem.value"
          :key="tableFormItem.key"
          :table-form-item="tableFormItem"
        />
      </el-form>
      <div class="btn-group">
        <el-button type="primary" :icon="Search">搜索</el-button>
        <el-button :icon="RefreshRight">重置</el-button>
      </div>
    </div>
    <div class="table-content"></div>
  </div>
</template>

<script lang="ts" setup>
import type { SearchListItem } from '@/components/common/table-with-search/const';
import tableFormItem from './table-form-item.vue';
import { Search, RefreshRight } from '@element-plus/icons-vue';

const modelValue = defineModel<SearchListItem[]>();
</script>

<style lang="less" scoped>
.table-with-search {
  width: 100%;

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
}
</style>
