<template>
  <div class="app">
    <ai-voice-chat-panel />
    <page-header v-if="isShowPageHeader"></page-header>
    <router-view :data-aos="routerViewAnimation"></router-view>
    <draggable-float class="app-float">
      <div class="app-float__content">😄</div>
    </draggable-float>
  </div>
</template>

<script setup lang="ts">
import AiVoiceChatPanel from '@/components/common/ai-voice-chat-panel/index.vue';
import DraggableFloat from '@/components/common/draggable-float/index.vue';
import PageHeader from '@/components/common/page-header/index.vue';
import { useActions } from '@/hooks';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from './hooks/use-theme';

const { 'commonModule/GETPROFILE_ACTION': getProfile_Action } = useActions([
  'commonModule/GETPROFILE_ACTION',
]);

const route = useRoute();
const isShowPageHeader = computed(() => route.meta.isShowPageHeader);
const routerViewAnimation = computed(() => (isShowPageHeader.value ? 'fade-up' : ''));

useTheme();

onMounted(async () => {
  getProfile_Action();
});
</script>

<style lang="less" scoped>
.app {
  position: relative;
  min-height: 100vh;
}

.app-float {
  width: 56px;
  height: 56px;
}

.app-float__content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 30px;
  background: linear-gradient(135deg, #fff7d6 0%, #ffe89a 100%);
  border: 1px solid rgb(255 196 61 / 70%);
  border-radius: 50%;
  box-shadow: 0 12px 30px rgb(255 196 61 / 28%);
}
</style>
