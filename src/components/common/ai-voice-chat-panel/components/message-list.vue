<template>
  <div ref="messageListRef" class="message-list">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message-row"
      :class="`is-${message.role}`"
    >
      <div class="message-bubble">
        <div class="message-meta">
          <span>{{ message.role === 'user' ? '用户' : '服务端' }}</span>
          <span>{{ message.statusText }}</span>
        </div>
        <p v-if="message.content" class="message-text">{{ getDisplayContent(message) }}</p>
        <voice-message-bubble
          v-if="message.audio"
          class="message-audio"
          :url="message.audio.url"
          :bars="message.audio.bars"
          :duration="message.audio.duration"
          :variant="message.role"
          :autoplay="message.autoPlayAudio"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import VoiceMessageBubble from './voice-message-bubble.vue';
import { getDisplayContent } from '../utils';
import type { ChatMessage } from '../types';

/** 消息列表入参，承载完整的对话消息集合。 */
const props = defineProps<{
  messages: ChatMessage[];
}>();

/** 消息列表根节点引用，用于在消息变化后滚动到底部。 */
const messageListRef = ref<HTMLElement | null>(null);

/**
 * 把消息列表滚动到最底部。
 * 当新消息追加或流式消息长度变化时，会自动调用它确保最新内容可见。
 *
 * @returns DOM 完成更新后的滚动 Promise
 */
const scrollToBottom = async () => {
  await nextTick();
  const target = messageListRef.value;

  if (!target) {
    return;
  }

  target.scrollTop = target.scrollHeight;
};

/**
 * 监听消息数量、消息状态和流式文本长度变化。
 * 只要界面内容高度可能变化，就自动滚动到最底部。
 */
watch(
  () => props.messages.map((item) => `${item.id}-${item.displayLength ?? 0}-${item.status}`).join('|'),
  () => {
    void scrollToBottom();
  },
  { immediate: true },
);
</script>

<style scoped lang="less">
.message-list {
  height: 100%;
  min-height: 0;
  padding: 0 28px 24px;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.message-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.message-row {
  display: flex;
  margin-bottom: 18px;
}

.message-row.is-user {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 78%;
  padding: 16px 18px;
  border-radius: 22px;
  box-shadow: 0 10px 24px rgb(28 48 92 / 10%);
}

.message-row.is-user .message-bubble {
  color: #fff;
  background: linear-gradient(135deg, #4f78dd 0%, #7394ea 100%);
  border-bottom-right-radius: 8px;
}

.message-row.is-assistant .message-bubble {
  color: #1f2f54;
  background: #fff;
  border: 1px solid rgb(120 144 204 / 18%);
  border-bottom-left-radius: 8px;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  opacity: 0.78;
}

.message-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.75;
  white-space: pre-wrap;
}

.message-audio {
  margin-top: 12px;
}
</style>
