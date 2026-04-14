<template>
  <div class="app">
    <section class="event-demo">
      <h2 class="event-demo__title">emit / on 调试示例</h2>
      <p class="event-demo__desc">
        这是一个用 JS 写的简单订阅发布模式示例，点击下面按钮可以直接测试。
      </p>

      <div class="event-demo__actions">
        <button class="event-demo__button" @click="emitMessage">
          发布普通消息
        </button>
        <button class="event-demo__button event-demo__button--secondary" @click="emitOnceMessage">
          发布 once 消息
        </button>
        <button class="event-demo__button event-demo__button--ghost" @click="clearLogs">
          清空日志
        </button>
      </div>

      <div class="event-demo__panel">
        <div class="event-demo__panel-title">监听结果</div>
        <ul class="event-demo__log-list">
          <li v-for="item in eventLogs" :key="item.id" class="event-demo__log-item">
            {{ item.text }}
          </li>
          <li v-if="!eventLogs.length" class="event-demo__empty">暂时还没有消息，点按钮试试。</li>
        </ul>
      </div>
    </section>

    <page-header v-if="isShowPageHeader"></page-header>
    <router-view :data-aos="routerViewAnimation"></router-view>
    <draggable-float class="app-float">
      <div class="app-float__content">😄</div>
    </draggable-float>
  </div>
</template>

<script setup lang="ts">
import DraggableFloat from '@/components/common/draggable-float/index.vue';
import PageHeader from '@/components/common/page-header/index.vue';
import { useActions } from '@/hooks';
import eventBus, { EVENT_NAMES } from '@/utils/event-bus';
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from './hooks/use-theme';

const { 'commonModule/GETPROFILE_ACTION': getProfile_Action } = useActions([
  'commonModule/GETPROFILE_ACTION',
]);

const route = useRoute();
const isShowPageHeader = computed(() => route.meta.isShowPageHeader);
const routerViewAnimation = computed(() => (isShowPageHeader.value ? 'fade-up' : ''));
const eventLogs = ref<{ id: number; text: string }[]>([]);
let logId = 0;

const addLog = (text: string) => {
  eventLogs.value.unshift({
    id: ++logId,
    text,
  });
};

const onAppMessage = (payload: { text: string; time: string }) => {
  addLog(`[on] 收到 ${EVENT_NAMES.APP_MESSAGE} -> ${payload.text} (${payload.time})`);
};

const emitMessage = () => {
  eventBus.emit(EVENT_NAMES.APP_MESSAGE, {
    text: '这是一条普通 emit 消息',
    time: new Date().toLocaleTimeString(),
  });
};

const emitOnceMessage = () => {
  eventBus.emit(EVENT_NAMES.APP_ONCE_MESSAGE, {
    text: '这是一条 once 消息，只会被监听一次',
    time: new Date().toLocaleTimeString(),
  });
};

const clearLogs = () => {
  eventLogs.value = [];
};

useTheme();

onMounted(async () => {
  eventBus.on(EVENT_NAMES.APP_MESSAGE, onAppMessage);
  eventBus.once(EVENT_NAMES.APP_ONCE_MESSAGE, (payload: { text: string; time: string }) => {
    addLog(`[once] 收到 app:once-message -> ${payload.text} (${payload.time})`);
  });

  addLog(
    `事件监听已注册：${EVENT_NAMES.APP_MESSAGE} / ${EVENT_NAMES.APP_ONCE_MESSAGE}`,
  );
  getProfile_Action();
});

onBeforeUnmount(() => {
  eventBus.off(EVENT_NAMES.APP_MESSAGE, onAppMessage);
});
</script>

<style lang="less" scoped>
.app {
  position: relative;
  min-height: 100vh;
}

.event-demo {
  position: relative;
  z-index: 2;
  max-width: 720px;
  padding: 24px;
  margin: 24px;
  background: linear-gradient(135deg, rgb(255 251 238 / 96%) 0%, rgb(255 243 205 / 96%) 100%);
  border: 1px solid rgb(232 193 91 / 38%);
  border-radius: 20px;
  box-shadow: 0 18px 44px rgb(123 84 0 / 10%);
}

.event-demo__title {
  margin: 0 0 8px;
  font-size: 22px;
  color: #6f4b00;
}

.event-demo__desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #8a6714;
}

.event-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.event-demo__button {
  padding: 10px 16px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #ffb347 0%, #ff8c42 100%);
  border: none;
  border-radius: 999px;
  box-shadow: 0 10px 22px rgb(255 140 66 / 24%);
}

.event-demo__button--secondary {
  background: linear-gradient(135deg, #ffcf5a 0%, #f0a202 100%);
}

.event-demo__button--ghost {
  color: #8a5a00;
  background: #fff;
  border: 1px solid rgb(240 162 2 / 30%);
  box-shadow: none;
}

.event-demo__panel {
  margin-top: 18px;
  background: rgb(255 255 255 / 70%);
  border-radius: 16px;
  padding: 16px;
}

.event-demo__panel-title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #6f4b00;
}

.event-demo__log-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.event-demo__log-item,
.event-demo__empty {
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #6a5323;
  background: rgb(255 248 232 / 95%);
  border-radius: 12px;
}

.event-demo__log-item + .event-demo__log-item {
  margin-top: 10px;
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
