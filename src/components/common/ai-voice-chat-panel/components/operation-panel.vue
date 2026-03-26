<template>
  <aside class="operation-column">
    <header class="panel-header">
      <div>
        <p class="panel-eyebrow">Response Action</p>
        <h3 class="panel-title small">服务返回操作区</h3>
      </div>
    </header>

    <div class="operation-card">
      <span class="operation-label">最近一次用户文本</span>
      <p class="operation-value">{{ latestResponse?.userText ?? '暂无' }}</p>
    </div>

    <div class="operation-card">
      <span class="operation-label">最近一次服务端回复</span>
      <p class="operation-value">{{ latestResponse?.assistantText ?? '等待 mock 数据' }}</p>
    </div>

    <div class="operation-card">
      <span class="operation-label">音频文件</span>
      <audio v-if="latestResponse?.audioUrl" :src="latestResponse.audioUrl" controls class="audio-player" />
      <p v-else class="operation-empty">服务端音频返回后会显示在这里。</p>
    </div>

    <div class="operation-card compact">
      <span class="operation-label">流式显示速度</span>
      <p class="operation-value">{{ streamSpeed }}ms / 字</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { MockResponse } from '../types';

/**
 * 右侧操作面板入参。
 * 用于展示最近一次 mock 返回以及当前流式速度配置。
 * 用户自己的录音不再在右侧单独回放，避免和主对话区职责重复。
 */
defineProps<{
  latestResponse: MockResponse | null;
  streamSpeed: number;
}>();
</script>

<style scoped lang="less">
.operation-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  padding: 24px;
  overflow: auto;
  background: linear-gradient(180deg, rgb(255 255 255 / 78%), rgb(241 246 255 / 92%));
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.operation-column::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  color: #6e7ea7;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.panel-title {
  margin: 0;
  font-size: 22px;
  color: #18233d;
}

.panel-title.small {
  font-size: 22px;
}

.operation-card {
  padding: 18px 18px 20px;
  background: rgb(255 255 255 / 88%);
  border: 1px solid rgb(117 141 201 / 14%);
  border-radius: 22px;
  box-shadow: 0 12px 24px rgb(43 63 114 / 8%);
}

.operation-card.compact {
  margin-top: auto;
}

.operation-label {
  display: block;
  margin-bottom: 10px;
  font-size: 12px;
  color: #7584a7;
  letter-spacing: 0.08em;
}

.operation-value,
.operation-empty {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #1f2f54;
}

.audio-player {
  width: 100%;
}
</style>
