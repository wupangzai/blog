<template>
  <div class="message-list">
    <dynamic-scroller
      ref="messageListRef"
      class="message-list__scroller"
      :items="messages"
      :min-item-size="96"
      key-field="id"
    >
      <template #default="{ item: rawItem, index, active }">
        <dynamic-scroller-item
          :item="rawItem"
          :active="active"
          :size-dependencies="getItemSizeDependencies(rawItem)"
          :data-index="index"
        >
          <div class="message-row" :class="`is-${toMessage(rawItem).role}`">
            <div class="message-bubble">
              <div class="message-meta">
                <span>{{ toMessage(rawItem).role === 'user' ? '用户' : '服务端' }}</span>
                <span>{{ toMessage(rawItem).statusText }}</span>
              </div>
              <p v-if="toMessage(rawItem).content" class="message-text">
                {{ getDisplayContent(toMessage(rawItem)) }}
              </p>
              <voice-message-bubble
                v-if="toMessage(rawItem).audio"
                class="message-audio"
                :bars="toMessage(rawItem).audio?.bars ?? []"
                :duration="toMessage(rawItem).audio?.duration ?? 0"
                :variant="toMessage(rawItem).role"
                :is-playing="activeAudioMessageId === toMessage(rawItem).id"
                :current-time="audioProgressMap[toMessage(rawItem).id] ?? 0"
                @toggle="emit('toggle-audio', toMessage(rawItem).id)"
              />
            </div>
          </div>
        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
  </div>
</template>

<script setup lang="ts">
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { nextTick, ref, watch } from 'vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import VoiceMessageBubble from './voice-message-bubble.vue';
import { getDisplayContent } from '../utils';
import type { ChatMessage } from '../types';

/** 消息列表入参，承载完整的对话消息集合以及音频播放状态。 */
const props = defineProps<{
  messages: ChatMessage[];
  activeAudioMessageId: number | null;
  audioProgressMap: Record<number, number>;
}>();

/** 消息列表对外抛出统一的音频点击事件。 */
const emit = defineEmits<{
  'toggle-audio': [messageId: number]
}>();

/** 虚拟滚动根节点引用，用于在新增消息后滚动到底部。 */
const messageListRef = ref<InstanceType<typeof DynamicScroller> | null>(null);

/**
 * 把虚拟滚动 slot 中的 `unknown` item 收窄为业务消息类型。
 *
 * @param item DynamicScroller 默认暴露的原始项
 * @returns 可安全供模板使用的聊天消息对象
 */
const toMessage = (item: unknown) => item as ChatMessage;

/**
 * 为虚拟滚动提供尺寸依赖。
 * 当文本长度、状态文案或音频信息变化时，会触发当前项重新计算高度。
 *
 * @param item 当前消息项
 * @returns 会影响消息高度的关键依赖数组
 */
const getItemSizeDependencies = (item: unknown) => {
  const message = toMessage(item);
  return [
    message.content,
    message.statusText,
    message.displayLength ?? 0,
    Boolean(message.audio),
    message.audio?.duration ?? 0,
  ];
};

/**
 * 把虚拟滚动列表滚动到最底部。
 * 因为使用了 DynamicScroller，需要等待 DOM 和尺寸重新计算完成后再执行滚动。
 *
 * @returns 滚动完成的 Promise
 */
const scrollToBottom = async () => {
  await nextTick();
  const target = messageListRef.value?.$el as HTMLElement | undefined;

  if (!target) {
    return;
  }

  target.scrollTop = target.scrollHeight;
};

/**
 * 监听消息数量、状态和流式内容长度变化。
 * 每次内容高度变化后都自动滚动到底部，保证最新消息始终可见。
 */
watch(
  () =>
    props.messages.map((item) => `${item.id}-${item.displayLength ?? 0}-${item.status}-${item.content.length}`).join('|'),
  () => {
    void scrollToBottom();
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
.message-list {
  height: 100%;
  min-height: 0;
  padding: 0 28px 24px;
  overflow: hidden;
}

.message-list__scroller {
  height: 100%;
  min-height: 0;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.message-list__scroller::-webkit-scrollbar {
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
