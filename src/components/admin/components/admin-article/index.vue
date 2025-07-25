<template>
  <div class="admin-aricle">
    <table-with-search v-model="searchList" />
  </div>
</template>

<script lang="ts" setup>
import tableWithSearch from '@/components/common/table-with-search/index.vue';
import { ref } from 'vue';

const searchList = ref([
  {
    key: 'articleTitle',
    label: '文章标题',
    componentKey: 'input',
    value: '',
  },
  {
    key: 'createTime',
    label: '创建时间',
    componentKey: 'date-picker',
    value: '',
    type: 'daterange',
    rangeSeparator: '至',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
  },
]);
</script>

<style lang="less" scoped>
.admin-aricle {
  width: 100%;
  border: 1px solid #000;
  padding: 20px !important;
}
</style>
