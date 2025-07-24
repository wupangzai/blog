<template>
  <div class="dash-board-statistic-card">
    <img :src="props.cardItem.icon" alt="" />
    <div class="info">
      <div class="label">{{ props.cardItem.label }}</div>
      <div class="count">{{ props.cardItem?.count }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DashboardStatisticsListItem } from '../const';

interface Props {
  cardItem: DashboardStatisticsListItem;
}

const props = defineProps<Props>();
</script>

<style lang="less" scoped>
.dash-board-statistic-card {
  width: 324px;
  height: 130px;
  border-radius: 8px;
  padding: 28px 20px;
  display: flex;
  align-items: center;
  gap: 18px;
  border: 1px solid var(--el-color-info-light-7);
  background-color: #fff;

  img {
    width: 40px;
    height: 40px;
  }

  .info {
    display: flex;
    flex-direction: column;
    color: #4c4e4d;
    gap: 8px;

    .count {
      font-weight: 700;
      font-size: 24px;
    }
  }
}
</style>
