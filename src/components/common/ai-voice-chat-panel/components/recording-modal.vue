<template>
  <div class="recording-modal">
    <div class="recording-card">
      <div class="recording-wave" :class="{ 'is-speaking': hasVoice }">
        <span
          v-for="(bar, index) in bars"
          :key="index"
          class="wave-bar"
          :style="{ height: `${bar}px` }"
        />
      </div>
      <h3>正在录音</h3>
      <p>{{ hasVoice ? '检测到你正在说话。' : '当前没有检测到语音输入。' }}</p>
      <button class="action-btn danger" @click="emit('stop')">停止录音</button>
    </div>
  </div>
</template>

<script setup lang="ts">
/** 录音弹窗入参，用于展示当前实时波形和说话状态。 */
defineProps<{
  bars: number[];
  hasVoice: boolean;
}>();

/** 录音弹窗对外只暴露一个停止事件。 */
const emit = defineEmits<{
  stop: []
}>();
</script>

<style scoped lang="less">
.recording-modal {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(17 26 46 / 38%);
  backdrop-filter: blur(8px);
}

.recording-card {
  width: 420px;
  padding: 28px;
  text-align: center;
  background: rgb(255 255 255 / 96%);
  border-radius: 28px;
  box-shadow: 0 24px 60px rgb(15 28 52 / 24%);
}

.recording-card h3 {
  margin: 0 0 10px;
  font-size: 28px;
  color: #18233d;
}

.recording-card p {
  margin: 0 0 24px;
  color: #637296;
}

.recording-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 92px;
  margin-bottom: 24px;
}

.wave-bar {
  width: 8px;
  min-height: 8px;
  background: linear-gradient(180deg, #5f83e7 0%, #87e5dc 100%);
  border-radius: 999px;
  transition: height 0.08s linear;
}

.recording-wave:not(.is-speaking) .wave-bar {
  opacity: 0.55;
}

.action-btn {
  min-width: 128px;
  padding: 12px 20px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 999px;
}

.action-btn.danger {
  color: #fff;
  background: linear-gradient(135deg, #ef635c 0%, #f2886a 100%);
}
</style>
