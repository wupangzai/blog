<template>
  <div class="page-content">
    <div class="router-content" data-aos="fade-up">
      <router-view />
    </div>
    <div class="card-content" data-aos="fade-up" data-aos-duration="1000">
      <side-bar></side-bar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import sideBar from '@/components/common/side-bar/index.vue';
</script>

<style lang="less" scoped>
.page-content {
  position: relative;
  width: 100%;
  background-color: var(--el-color-info-light-9);
  display: flex;
  justify-content: center;
  padding: 16px 0 28px 0;
  min-height: calc(100vh - 68px);

  .router-content {
    width: 917px;
    max-width: 917px;
    height: 100%;
    margin-right: 28px;
  }

  .card-content {
    position: sticky;
    top: 68px;
    right: 0;
    width: 290px;
    max-width: 290px;
    height: 100%;
  }
}
</style>
