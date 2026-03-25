<template>
  <button
    class="voice-bubble"
    :data-variant="props.variant ?? 'assistant'"
    type="button"
    @click="togglePlayback"
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * 语音消息气泡入参。
 * `url` 用于播放音频，`bars` 用于展示波形，`duration` 用于显示秒数。
 */
const props = defineProps<{
  url: string;
  bars: number[];
  duration: number;
  variant?: 'user' | 'assistant';
  autoplay?: boolean;
}>();

/** 当前语音消息专属的 audio 实例，用于控制播放、暂停和进度。 */
const audio = new Audio();
/** 当前是否处于播放中，用于切换按钮文案。 */
const isPlaying = ref(false);
/** 当前播放进度，单位秒，用于计算已播放波形进度。 */
const currentTime = ref(0);

/** 预加载策略设置为自动，减少用户点击播放时的等待。 */
audio.preload = 'auto';

/**
 * 语音时长文案。
 * 界面上使用微信风格的秒数显示，如 `5"`。
 */
const durationLabel = computed(() => `${Math.max(1, props.duration)}"`);

/**
 * 根据当前播放进度计算已播放到第几个波形条。
 * 用于把已播放部分渲染成更深的颜色。
 */
const playedBarIndex = computed(() => {
  const duration = Math.max(props.duration, 1);
  const progress = Math.min(currentTime.value / duration, 1);
  return Math.floor(progress * Math.max(props.bars.length - 1, 0));
});

/**
 * 保证当前 audio 实例绑定的是最新消息音频地址。
 * 当气泡复用或音频地址变化时，会在首次播放前同步更新。
 */
const syncAudioSource = () => {
  if (audio.src !== props.url) {
    audio.src = props.url;
    audio.load();
  }
};

/**
 * 暂停当前语音播放，并同步更新界面状态。
 */
const pauseAudio = () => {
  audio.pause();
  isPlaying.value = false;
};

/**
 * 从当前位置开始播放语音。
 * 如果上一次已经播完，则会自动从头重新开始。
 *
 * @returns 浏览器开始播放后的 Promise
 */
const playAudio = async () => {
  syncAudioSource();

  if (audio.ended) {
    audio.currentTime = 0;
    currentTime.value = 0;
  }

  await audio.play();
  isPlaying.value = true;
};

/**
 * 播放按钮点击逻辑。
 * 播放中则暂停，暂停中则继续播放。
 *
 * @returns 切换播放状态的 Promise
 */
const togglePlayback = async () => {
  if (isPlaying.value) {
    pauseAudio();
    return;
  }

  try {
    await playAudio();
  } catch {
    pauseAudio();
  }
};

/** 组件首次渲染后可按需自动播放服务端返回语音。 */
onMounted(() => {
  if (!props.autoplay) {
    return;
  }

  void playAudio().catch(() => {
    pauseAudio();
  });
});

/** 播放中持续同步当前时间，用于更新已播放波形进度。 */
audio.addEventListener('timeupdate', () => {
  currentTime.value = audio.currentTime || 0;
});

/** 音频进入暂停状态时，重置播放标记。 */
audio.addEventListener('pause', () => {
  isPlaying.value = false;
});

/** 播放完成后回到起点，方便用户再次点击从头播放。 */
audio.addEventListener('ended', () => {
  isPlaying.value = false;
  currentTime.value = 0;
  audio.currentTime = 0;
});

/** 组件销毁前停止播放并释放音频地址引用。 */
onBeforeUnmount(() => {
  pauseAudio();
  audio.src = '';
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
