<template>
  <div class="page-content">
    <!-- <canvas id="code-bg"></canvas> -->

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
// import { useCodeBg } from '@/hooks/use-code-bg';
// useCodeBg();
</script>

<style lang="less" scoped>
#code-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
}

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
