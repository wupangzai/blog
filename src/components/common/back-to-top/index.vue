<template>
  <teleport to="body">
    <transition name="back-to-top-fade">
      <button v-if="isVisible" class="back-to-top" type="button" @click="scrollToTop">
        <el-icon :size="20"><Top /></el-icon>
      </button>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { Top } from '@element-plus/icons-vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const isVisible = ref(false);

function getScrollElement() {
  return document.scrollingElement || document.documentElement || document.body;
}

function updateVisible() {
  isVisible.value = getScrollElement().scrollTop > 0;
}

function scrollToTop() {
  getScrollElement().scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

onMounted(() => {
  updateVisible();
  window.addEventListener('scroll', updateVisible, { passive: true, capture: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisible, { capture: true });
});
</script>

<style lang="less" scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 44px;
  height: 44px;
  border: 1px solid var(--el-color-info-light-5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--custom-notice-bg-color);
  color: var(--el-color-primary);
  box-shadow: 0 10px 24px rgb(15 23 42 / 10%);
  cursor: pointer;
  z-index: 1000;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgb(15 23 42 / 16%);
  }
}

.back-to-top-fade-enter-active,
.back-to-top-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.back-to-top-fade-enter-from,
.back-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 767px) {
  .back-to-top {
    right: 16px;
    bottom: 16px;
  }
}
</style>
