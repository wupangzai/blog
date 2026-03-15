<template>
  <div class="page-content">
    <canvas id="code-bg" :style="{ visibility: isShowCodeBg ? 'visible' : 'hidden' }"></canvas>

    <div class="router-content" data-aos="fade-up">
      <router-view />
    </div>
    <div
      class="card-content"
      :class="{ 'hide-on-home-mobile': route.path === '/' }"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <side-bar
        :mobile-hide-profile-card="sidebarMobileConfig.hideProfileCard"
        :mobile-hidden-tag-types="sidebarMobileConfig.hiddenTagTypes"
      ></side-bar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import sideBar from '@/components/common/side-bar/index.vue';
import { useStates } from '@/hooks';
import { useCodeBg } from '@/hooks/use-code-bg';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const { theme } = useStates(['theme']);
const route = useRoute();

const isShowCodeBg = computed(() => theme.value === 'dark');
const sidebarMobileConfig = computed(() => {
  switch (route.path) {
    case '/categories':
      return {
        hideProfileCard: true,
        hiddenTagTypes: ['label'],
      };
    case '/label':
      return {
        hideProfileCard: true,
        hiddenTagTypes: ['categories'],
      };
    case '/achieve':
    case '/wiki':
      return {
        hideProfileCard: true,
        hiddenTagTypes: ['categories', 'label'],
      };
    default:
      return {
        hideProfileCard: false,
        hiddenTagTypes: [],
      };
  }
});

useCodeBg();
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
  gap: 28px;
  padding: 16px 24px 28px;
  min-height: calc(100vh - 68px);

  .router-content {
    width: 100%;
    max-width: 917px;
    height: 100%;
  }

  .card-content {
    position: sticky;
    top: 68px;
    right: 0;
    width: 100%;
    max-width: 290px;
    height: 100%;
  }
}

@media (max-width: 1100px) {
  .page-content {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    padding: 16px;

    .router-content,
    .card-content {
      max-width: 917px;
    }

    .card-content {
      position: static;
    }
  }
}

@media (max-width: 767px) {
  .page-content {
    padding: 12px;
  }

  .card-content.hide-on-home-mobile {
    display: none;
  }
}
</style>
