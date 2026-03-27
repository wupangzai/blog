<template>
  <button
    class="voice-bubble"
    :data-variant="props.variant ?? 'assistant'"
    type="button"
    @click="emit('toggle')"
  >
    <span class="voice-bubble__icon">{{ isPlaying ? '暂停' : '播放' }}</span>
    <span class="voice-bubble__bars">
      <span
        v-for="(bar, index) in bars"
        :key="index"
        class="voice-bubble__bar"
        :class="{ 'is-played': index <= playedBarIndex }"
        :style="{ height: `${Math.max(bar * 34, 8)}px` }"
      />
    </span>
    <span class="voice-bubble__duration">{{ durationLabel }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * 语音消息气泡入参。
 * 当前组件只负责展示语音 UI，不再自己持有 Audio 实例。
 * 所有播放、暂停、进度恢复逻辑统一交给父级管理。
 */
const props = defineProps<{
  bars: number[];
  duration: number;
  variant?: 'user' | 'assistant';
  isPlaying?: boolean;
  currentTime?: number;
}>();

/** 对外抛出切换播放事件，由父组件统一处理音频实例。 */
const emit = defineEmits<{
  toggle: []
}>();

/**
 * 语音时长文案。
 * 界面上使用微信风格的秒数显示，如 `5"`。
 */
const durationLabel = computed(() => `${Math.max(1, props.duration)}"`);
/** 当前是否处于播放中，由父组件统一维护。 */
const isPlaying = computed(() => Boolean(props.isPlaying));

/**
 * 根据当前播放进度计算已播放到第几个波形条。
 * 用于把已播放部分渲染成更深的颜色。
 */
const playedBarIndex = computed(() => {
  const duration = Math.max(props.duration, 1);
  const progress = Math.min((props.currentTime ?? 0) / duration, 1);
  return Math.floor(progress * Math.max(props.bars.length - 1, 0));
});
</script>

<style scoped lang="less">
.voice-bubble {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 6px 0;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
}

.voice-bubble:deep(*) {
  pointer-events: none;
}

.voice-bubble__icon {
  flex: 0 0 auto;
  min-width: 28px;
  font-size: 12px;
  opacity: 0.92;
}

.voice-bubble__bars {
  display: flex;
  align-items: center;
  gap: 3px;
  flex: 1;
  min-width: 0;
  height: 34px;
}

.voice-bubble__bar {
  width: 3px;
  min-height: 8px;
  background: rgb(74 109 188 / 24%);
  border-radius: 999px;
  transition: background-color 0.18s ease;
}

.is-played {
  background: rgb(58 86 153 / 70%);
}

.voice-bubble__icon,
.voice-bubble__duration {
  color: #36518f;
}

.voice-bubble[data-variant='user'] .voice-bubble__bar {
  background: rgb(255 255 255 / 48%);
}

.voice-bubble[data-variant='user'] .is-played {
  background: rgb(255 255 255 / 88%);
}

.voice-bubble[data-variant='user'] .voice-bubble__icon,
.voice-bubble[data-variant='user'] .voice-bubble__duration {
  color: #fff;
}

.voice-bubble__duration {
  flex: 0 0 auto;
  min-width: 30px;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
</style>
