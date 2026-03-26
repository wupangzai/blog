<template>
  <div class="ai-chat-panel">
    <section class="chat-column">
      <header class="panel-header">
        <div>
          <p class="panel-eyebrow">Mock AI Assistant</p>
          <h2 class="panel-title">语音对话工作台</h2>
        </div>
        <span class="panel-status">{{ panelStatus }}</span>
      </header>

      <div class="chat-body">
        <message-list :messages="messages" />
        <chat-input-panel
          :draft-text="draftText"
          @update:draft-text="draftText = $event"
          @send-text="sendTypedMessage"
          @start-recording="handleStartRecording"
        />
      </div>
    </section>

    <operation-panel
      :latest-response="latestResponse"
      :stream-speed="props.streamSpeed"
    />

    <recording-modal
      v-if="isRecording"
      :bars="bars"
      :has-voice="hasVoice"
      @stop="handleStopRecording"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import ChatInputPanel from './components/chat-input-panel.vue';
import MessageList from './components/message-list.vue';
import OperationPanel from './components/operation-panel.vue';
import RecordingModal from './components/recording-modal.vue';
import {
  defaultPanelConfig,
  initialAssistantMessage,
  mockConversationSeeds,
  typedInputMockReply,
} from './mock-config';
import type { ChatMessage, MockResponse } from './types';
import { createAudioMessagePayload, createSilentWavBlob } from './utils';
import { useLiveWaveform } from './use-live-waveform';

/**
 * 面板对外配置项。
 * 通过默认值隐藏大多数细节，只暴露少量可调参数给使用方。
 */
const props = withDefaults(
  defineProps<{
    streamSpeed?: number;
    mockDelay?: number;
    recordingBars?: number;
  }>(),
  defaultPanelConfig
);

/** 当前文本输入框草稿内容。 */
const draftText = ref('');
/** 是否正在录音，用于控制录音弹窗显隐和顶部状态文案。 */
const isResponding = ref(false);
/** 是否处于录音停止收尾阶段，避免重复点击停止。 */
const isStoppingRecording = ref(false);
/** 最近一次服务端返回的数据，用于右侧操作面板展示。 */
const latestResponse = ref<MockResponse | null>(null);
/** 对话区消息列表，统一管理用户消息和服务端消息。 */
const messages = ref<ChatMessage[]>([
  {
    id: 1,
    role: 'assistant',
    content: initialAssistantMessage,
    displayLength: initialAssistantMessage.length,
    status: 'done',
    statusText: '已完成',
  },
]);

/**
 * 顶部状态角标文案。
 * 优先展示录音中，其次展示处理中，空闲时为待命。
 */
const panelStatus = computed(() =>
  isRecording.value ? '录音中' : isResponding.value ? '处理中' : '待命'
);

/** 录音 hook，统一提供设备状态、录音控制与录音结果。 */
const {
  isDeviceAvailable,
  isRecording,
  bars,
  hasVoice,
  startRecording,
  stopRecording,
  audioBlob,
  pcmBuffer,
  release: releaseRecorder,
} = useLiveWaveform(props.recordingBars);

/** 自增消息 id，确保每条消息拥有稳定唯一标识。 */
let messageId = messages.value.length;
/** 服务端流式输出的定时器 id。 */
let streamTimer: number | null = null;
/** 当前页面生命周期内创建过的对象地址，卸载时统一回收。 */
let pendingAudioUrls: string[] = [];
/** 当前待转译用户消息的 id，用于服务端返回后回填真实转译文本。 */
let pendingVoiceMessageId: number | null = null;

/**
 * 生成新的消息 id。
 * 统一由这里维护自增逻辑，避免不同消息分支直接操作共享计数器。
 *
 * @returns 新的唯一消息 id
 */
const createMessageId = () => {
  messageId += 1;
  return messageId;
};

/**
 * 向消息列表追加一条消息。
 * 这样可以把“创建消息”和“写入状态”统一收口到同一个入口。
 *
 * @param message 需要追加的消息对象
 * @returns 原样返回消息对象，便于后续继续读取其 id
 */
const appendMessage = (message: ChatMessage) => {
  messages.value.push(message);
  return message;
};

/**
 * 创建用户文本消息。
 * 当前同时用于普通文字输入，以及录音结束后的“正在发送”占位消息。
 *
 * @param content 要展示的文本内容
 * @param status 消息状态
 * @param statusText 消息状态对应的短文案
 * @returns 标准化后的用户消息对象
 */
const createUserTextMessage = (
  content: string,
  status: ChatMessage['status'],
  statusText: string
): ChatMessage => ({
  id: createMessageId(),
  role: 'user',
  kind: 'text',
  content,
  status,
  statusText,
});

/**
 * 创建服务端消息。
 * 服务端消息会同时携带文本和语音，用于在同一个气泡中展示回答内容与播放能力。
 *
 * @param response mock 服务端返回结果
 * @returns 标准化后的服务端消息对象
 */
const createAssistantMessage = (response: MockResponse): ChatMessage => ({
  id: createMessageId(),
  role: 'assistant',
  kind: response.assistantAudio ? 'audio' : 'text',
  content: response.assistantText,
  displayLength: 0,
  status: 'streaming',
  statusText: '输出中',
  audio: response.assistantAudio,
  autoPlayAudio: true,
});

/**
 * 注册一个对象地址，便于组件销毁时统一释放。
 *
 * @param url 需要跟踪的对象地址
 * @returns 原样返回传入地址，便于链式调用
 */
const registerAudioUrl = (url: string) => {
  pendingAudioUrls.push(url);
  return url;
};

/**
 * 启动服务端消息的伪流式输出。
 * 虽然 mock 是一次性返回整段文本，但这里按字符定时追加，模拟真实流式效果。
 *
 * @param messageIdToStream 要流式更新的消息 id
 * @param content 需要逐字显示的完整内容
 */
const startAssistantStream = (messageIdToStream: number, content: string) => {
  if (streamTimer) {
    window.clearInterval(streamTimer);
  }

  const targetMessage = messages.value.find((item) => item.id === messageIdToStream);

  if (!targetMessage) {
    return;
  }

  targetMessage.displayLength = 0;
  targetMessage.status = 'streaming';
  targetMessage.statusText = '输出中';

  streamTimer = window.setInterval(() => {
    const currentMessage = messages.value.find((item) => item.id === messageIdToStream);

    if (!currentMessage) {
      if (streamTimer) {
        window.clearInterval(streamTimer);
        streamTimer = null;
      }
      return;
    }

    const nextLength = (currentMessage.displayLength ?? 0) + 1;
    currentMessage.displayLength = nextLength;

    if (nextLength >= content.length) {
      currentMessage.displayLength = content.length;
      currentMessage.status = 'done';
      currentMessage.statusText = '已完成';
      isResponding.value = false;

      if (streamTimer) {
        window.clearInterval(streamTimer);
        streamTimer = null;
      }
    }
  }, props.streamSpeed);
};

/**
 * 构造一份随机 mock 响应。
 * 同时附带一段静音音频与语音气泡数据，用于模拟服务端返回的回答语音。
 *
 * @returns 一次完整的 mock 返回数据
 */
const buildMockResponse = async (): Promise<MockResponse> => {
  const randomIndex = Math.floor(Math.random() * mockConversationSeeds.length);
  const seed = mockConversationSeeds[randomIndex];
  const audioBlob = createSilentWavBlob();
  const audioUrl = registerAudioUrl(URL.createObjectURL(audioBlob));
  const assistantAudio = await createAudioMessagePayload(audioBlob, audioUrl);

  return {
    userText: seed.userText,
    assistantText: seed.assistantText,
    audioUrl,
    assistantAudio,
  };
};

/**
 * 把服务端回复压入消息列表，并启动流式显示效果。
 *
 * @param response mock 服务端响应
 */
const pushAssistantMessage = (response: MockResponse) => {
  const assistantMessage = appendMessage(createAssistantMessage(response));

  latestResponse.value = response;
  startAssistantStream(assistantMessage.id, response.assistantText);
};

/**
 * 使用 mock 返回结果更新用户消息状态，并补充一条服务端消息。
 * 新需求下，用户语音不再显示为语音气泡，而是回填成服务端转译后的文本。
 *
 * @param response mock 服务端响应
 * @param userMessageId 对应的用户消息 id
 */
const pushConversationFromResponse = (response: MockResponse, userMessageId: number) => {
  const userMessage = messages.value.find((item) => item.id === userMessageId);

  if (userMessage) {
    userMessage.content = response.userText;
    userMessage.status = 'done';
    userMessage.statusText = '已发送';
  }

  pushAssistantMessage(response);
};

/**
 * 模拟一次语音请求的完整返回。
 * 当前只做延迟 + 随机 mock 数据，用于还原“录音 -> 转译 -> 回复”链路。
 *
 * @param userMessageId 对应待转译的语音消息 id
 */
const simulateVoiceRequest = (userMessageId: number) => {
  isResponding.value = true;

  window.setTimeout(async () => {
    /**
     * 当前 mock 仅使用录音结果作为“已完成录音”的前置条件。
     * 真实接后端时，这里可以直接把 hook 暴露的 `audioBlob`、`pcmBuffer` 上传给服务端。
     */
    void audioBlob.value;
    void pcmBuffer.value;
    const response = await buildMockResponse();
    pushConversationFromResponse(response, userMessageId);
  }, props.mockDelay);
};

/**
 * 开始录音。
 * 先初始化麦克风波形会话，再启动 MediaRecorder；任一阶段失败都会做资源回收。
 *
 * @returns 录音开始流程的 Promise
 */
const handleStartRecording = async () => {
  if (isResponding.value || isRecording.value || isStoppingRecording.value) {
    return;
  }

  try {
    await startRecording();
  } catch {
    window.alert(
      isDeviceAvailable.value ? '录音初始化失败，请稍后重试。' : '无法访问麦克风，请检查浏览器录音权限。'
    );
  }
};

/**
 * 停止录音。
 * 会先创建一条“正在发送”的用户消息占位，待服务端返回后再回填转译文本。
 *
 * @returns 停止录音并触发 mock 转译流程的 Promise
 */
const handleStopRecording = async () => {
  if (!isRecording.value || isStoppingRecording.value) {
    return;
  }

  isStoppingRecording.value = true;
  pendingVoiceMessageId = appendMessage(
    createUserTextMessage('正在发送...', 'pending', '正在发送')
  ).id;

  try {
    await stopRecording();
    if (pendingVoiceMessageId !== null) {
      simulateVoiceRequest(pendingVoiceMessageId);
    }
  } finally {
    pendingVoiceMessageId = null;
    isStoppingRecording.value = false;
  }
};

/**
 * 发送文字消息。
 * 当前用于演示非语音输入场景，发送后同样走 mock 服务端回复流程。
 */
const sendTypedMessage = () => {
  const content = draftText.value.trim();

  if (!content || isResponding.value || isRecording.value) {
    return;
  }

  appendMessage(createUserTextMessage(content, 'done', '已发送'));

  draftText.value = '';
  isResponding.value = true;

  window.setTimeout(() => {
    void (async () => {
      const audioBlob = createSilentWavBlob();
      const audioUrl = registerAudioUrl(URL.createObjectURL(audioBlob));
      const response: MockResponse = {
        userText: content,
        assistantText: typedInputMockReply,
        audioUrl,
        assistantAudio: await createAudioMessagePayload(audioBlob, audioUrl),
      };

      latestResponse.value = response;
      pushAssistantMessage(response);
    })();
  }, props.mockDelay);
};

/**
 * 组件卸载前的统一资源清理。
 * 会停止录音、关闭波形会话、清理定时器，并释放所有对象地址。
 */
onBeforeUnmount(() => {
  void releaseRecorder();

  if (streamTimer) {
    window.clearInterval(streamTimer);
  }

  pendingAudioUrls.forEach((url) => URL.revokeObjectURL(url));
  pendingAudioUrls = [];
});
</script>

<style scoped lang="less">
.ai-chat-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  display: grid;
  grid-template-columns: 2fr 1fr;
  width: 1280px;
  height: 1024px;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgb(91 141 239 / 22%), transparent 28%),
    linear-gradient(160deg, #f7f9ff 0%, #eef4ff 45%, #fdfcff 100%);
  border: 1px solid rgb(109 132 198 / 18%);
  border-radius: 28px;
  box-shadow: 0 30px 80px rgb(31 47 84 / 20%);
  transform: translate(-50%, -50%);
  backdrop-filter: blur(16px);
}

.chat-column,
.operation-column {
  min-width: 0;
}

.chat-column {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 0;
  border-right: 1px solid rgb(109 132 198 / 12%);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 20px;
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
  font-size: 28px;
  color: #18233d;
}

.panel-status {
  padding: 8px 14px;
  font-size: 13px;
  color: #35539d;
  background: rgb(70 109 201 / 10%);
  border-radius: 999px;
}

.chat-body {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 320px;
  min-height: 0;
  overflow: hidden;
}
</style>
