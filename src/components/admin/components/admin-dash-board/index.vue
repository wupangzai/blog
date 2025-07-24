<template>
  <div class="admin-dash-board">
    <div class="statistic">
      <dash-board-statistic-card
        v-for="cardItem in dashboardStatisticsMapList"
        :card-item="cardItem"
        :key="cardItem.key"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import type { AdminDashBoardType } from '@/api/types';
import APIConst from '@/api/default-const';
import API from '@/api';
import dashBoardStatisticCard from '@/components/admin/components/admin-dash-board/dash-board-statistic-card/index.vue';
import { dashboardStatisticsList } from './const';

const dashboardStatistics = ref<AdminDashBoardType.DashboardStatistics>(
  APIConst.AdminDashBoardConst.defaultDashboardStatistics()
);

async function getDashboardStatistics() {
  const resp = await API.AdminDashBoard.getDashboardStatistics();
  if (resp) {
    dashboardStatistics.value = resp.data;
  }
}

const dashboardStatisticsMapList = computed(() => {
  const copyList = [...dashboardStatisticsList];
  return copyList.map((item) => {
    const count =
      dashboardStatistics.value[item.key as keyof AdminDashBoardType.DashboardStatistics];

    return { ...item, count };
  });
});

onMounted(() => {
  getDashboardStatistics();
});
</script>

<style lang="less" scoped>
.admin-dash-board {
  width: 100%;
  height: 1500px;
  background-color: aliceblue;

  .statistic {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
