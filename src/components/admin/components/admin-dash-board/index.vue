<template>
  <div class="admin-dash-board">
    <div class="statistic">
      <dash-board-statistic-card
        v-for="cardItem in dashboardStatisticsMapList"
        :card-item="cardItem"
        :key="cardItem.key"
      />
    </div>
    <div class="charts-container">
      <div class="charts">
        <div class="title">
          <img src="@/assets/svg/dashboard-calendar.svg" alt="" />
          <div class="label">近半年文章发布热点图</div>
        </div>
        <v-chart class="chart heat-chart" :option="calendarChartOptions" />
      </div>
      <div class="charts">
        <div class="title">
          <img src="@/assets/svg/dashboard-pv.svg" alt="" />
          <div class="label">近一周 PV 访问量</div>
        </div>
        <v-chart :option="chartPvOptions" class="chart" />
      </div>
      <div class="charts">
        <div class="title">
          <img src="@/assets/svg/dashboard-piechart.svg" alt="" />
          <div class="label">文章分类统计</div>
        </div>
        <v-chart :option="pieOptions" class="chart" />
      </div>
      <div class="charts">
        <div class="title">
          <img src="@/assets/svg/dashboard-line.svg" alt="" />
          <div class="label">文章分类统计</div>
        </div>
        <v-chart :option="barChartOptions" class="chart" />
      </div>
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
import dayjs from 'dayjs';

const now = dayjs();
const sixMonthsAgo = now.subtract(6, 'month');

// chart 配置
const calendarChartOptions = computed(() => ({
  tooltip: {
    position: 'top',
    formatter: ({ value }: any) => `${value[0]}：${value[1]}篇`,
  },

  visualMap: {
    show: false,
    min: 0,
    max: 5,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: 20,
    inRange: {
      color: ['#fff7e6', '#ffc07f', '#ff7f50', '#d9381e', '#7f0000'],
    },
  },
  calendar: {
    range: [sixMonthsAgo.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')],
    cellSize: ['auto', 20],
    dayLabel: {
      nameMap: 'ZH',
    },
    monthLabel: {
      nameMap: 'ZH',
    },
    yearLabel: {
      show: true,
    },
    left: 70,
    right: 40,
    top: 40,
    bottom: 40,
  },

  series: [
    {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: dashboardPAStatistics.value ? Object.entries(dashboardPAStatistics.value) : [],
    },
  ],
}));

const dashboardPAStatistics = ref<Record<string, any>>({});

async function getDashboardPAStatistics() {
  const resp = await API.AdminDashBoard.getDashboardPAStatistics();
  if (resp) {
    dashboardPAStatistics.value = resp.data;
  }
}

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

const chartPvOptions = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['阅读量'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dashboardPvStatistics.value.pvDates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '阅读量',
        type: 'line',
        data: dashboardPvStatistics.value.pvCounts,
      },
    ],
  };
});

const dashboardPvStatistics = ref<AdminDashBoardType.DashboardPvStatistics>(
  APIConst.AdminDashBoardConst.defaultDashboardPvStatistics()
);
async function getDashboardPvStatistics() {
  const resp = await API.AdminDashBoard.getDashboardPvStatistics();
  if (resp) {
    dashboardPvStatistics.value = resp.data;
  }
}

const pieOptions = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: dashboardCategoryStatistics.value.map((item) => item.name),
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '50%',
      data: dashboardCategoryStatistics.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}));

const dashboardCategoryStatistics = ref<AdminDashBoardType.DashboardCategoryStatistics[]>([]);

async function getDashboardCategoryStatistics() {
  const resp = await API.AdminDashBoard.getDashboardCategoryStatistics();
  if (resp) {
    dashboardCategoryStatistics.value = resp.data;
  }
}

const barChartOptions = computed(() => ({
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['文章数量'],
    top: '10%',
  },
  xAxis: {
    type: 'category',
    data: dashboardTagStatistics.value.tagNames,
    axisTick: {
      alignWithLabel: true,
    },
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '文章数量',
      type: 'bar',
      data: dashboardTagStatistics.value.articleCounts,
      barWidth: '50%',
      itemStyle: {
        color: '#5470C6',
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
}));

const dashboardTagStatistics = ref<AdminDashBoardType.DashboardTagStatistics>(
  APIConst.AdminDashBoardConst.defaultDashboardTagStatistics()
);

async function getDashboardTagStatistics() {
  const resp = await API.AdminDashBoard.getDashboardTagStatistics();
  if (resp) {
    dashboardTagStatistics.value = resp.data;
  }
}

onMounted(() => {
  getDashboardStatistics();
  getDashboardPAStatistics();
  getDashboardPvStatistics();
  getDashboardCategoryStatistics();
  getDashboardTagStatistics();
});
</script>

<style lang="less" scoped>
.admin-dash-board {
  width: 100%;
  height: 1500px;
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .statistic {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }

  .charts-container {
    width: 100%;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .heat-chart {
      :deep(canvas) {
        // left: calc(-20px) !important;
      }
    }

    .charts {
      width: 49%;
      display: flex;
      flex-direction: column;
      gap: 24px;
      background-color: #fff;
      padding: 28px 20px;
      border-radius: 8px;
      margin-bottom: 28px;

      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        img {
          width: 20px;
          height: 20px;
        }
        .label {
          color: #4b5563;
          font-weight: 700;
          font-size: 16px;
        }
      }
      .chart {
        width: auto;
        height: 342px;
      }
    }
  }
}
</style>
