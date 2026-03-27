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
        <message-list
          :messages="messages"
          :active-audio-message-id="playingAudioMessageId"
          :audio-progress-map="audioProgressMap"
          @toggle-audio="handleToggleMessageAudio"
        />
        <chat-input-panel
          :draft-text="draftText"
          @update:draft-text="draftText = $event"
          @send-text="sendTypedMessage"
          @start-recording="handleStartRecording"
        />
      </div>
    </section>

    <operation-panel :latest-response="latestResponse" :stream-speed="props.streamSpeed" />

    <recording-modal
      v-if="isRecording"
      :bars="bars"
      :has-voice="hasVoice"
      @stop="handleStopRecording"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
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
/** 根组件统一管理的音频播放器实例，所有消息共用这一个 Audio。 */
const messageAudio = new Audio();
/** 当前被选中并绑定到播放器的消息 id。 */
const currentAudioMessageId = ref<number | null>(null);
/** 当前真正处于播放中的消息 id，仅用于驱动界面播放态。 */
const playingAudioMessageId = ref<number | null>(null);
/** 各条语音消息最近一次播放进度，单位秒。 */
const audioProgressMap = reactive<Record<number, number>>({});
/** 标记当前 pause 事件是否来自程序内部的切源/主动暂停，避免误伤用户点击播放状态。 */
let isInternalAudioStateChange = false;
/** 每次播放请求递增一次，用于忽略旧请求产生的迟到事件。 */
let audioPlayRequestId = 0;

/** 播放过程中持续记录当前消息的播放进度。 */
messageAudio.addEventListener('timeupdate', () => {
  if (currentAudioMessageId.value === null) {
    return;
  }

  audioProgressMap[currentAudioMessageId.value] = messageAudio.currentTime || 0;
});

/** 播放真正开始后再同步“正在播放”的界面状态。 */
messageAudio.addEventListener('play', () => {
  if (currentAudioMessageId.value === null) {
    return;
  }

  playingAudioMessageId.value = currentAudioMessageId.value;
});

/** 手动暂停时保留进度，并取消“正在播放”的标记。 */
messageAudio.addEventListener('pause', () => {
  if (isInternalAudioStateChange) {
    return;
  }

  if (currentAudioMessageId.value === null) {
    return;
  }

  audioProgressMap[currentAudioMessageId.value] = messageAudio.currentTime || 0;
  playingAudioMessageId.value = null;
});

/** 播放结束后把进度归零，下一次点击从头开始播放。 */
messageAudio.addEventListener('ended', () => {
  if (currentAudioMessageId.value === null) {
    return;
  }

  audioProgressMap[currentAudioMessageId.value] = 0;
  playingAudioMessageId.value = null;
  currentAudioMessageId.value = null;
  messageAudio.currentTime = 0;
});

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
 * 根据消息 id 获取对应的语音地址。
 *
 * @param messageId 目标消息 id
 * @returns 当前消息对应的音频地址；不存在时返回空字符串
 */
const getMessageAudioUrl = (messageId: number) =>
  messages.value.find((item) => item.id === messageId)?.audio?.url ?? '';

/**
 * 根据消息 id 获取对应语音时长。
 *
 * @param messageId 目标消息 id
 * @returns 当前消息的语音总时长，缺失时返回 0
 */
const getMessageAudioDuration = (messageId: number) =>
  messages.value.find((item) => item.id === messageId)?.audio?.duration ?? 0;

/**
 * 规范化恢复播放时的起始时间。
 * 如果上次进度已经接近结尾，则直接从头开始播放，避免“点击后立刻结束”。
 *
 * @param messageId 目标消息 id
 * @param restart 是否强制从头播放
 * @returns 本次播放应使用的起始秒数
 */
const resolvePlaybackStartTime = (messageId: number, restart: boolean) => {
  if (restart) {
    return 0;
  }

  const savedTime = audioProgressMap[messageId] ?? 0;
  const duration = getMessageAudioDuration(messageId);

  if (!duration) {
    return savedTime;
  }

  return savedTime >= Math.max(duration - 0.12, 0) ? 0 : savedTime;
};

/**
 * 暂停当前正在播放的消息音频。
 * 进度会保留在 `audioProgressMap` 中，方便用户稍后继续播放。
 */
const pauseActiveMessageAudio = (clearCurrentMessage = true) => {
  isInternalAudioStateChange = true;

  if (currentAudioMessageId.value !== null) {
    audioProgressMap[currentAudioMessageId.value] = messageAudio.currentTime || 0;
  }

  messageAudio.pause();
  playingAudioMessageId.value = null;
  if (clearCurrentMessage) {
    currentAudioMessageId.value = null;
  }
  isInternalAudioStateChange = false;
};

/**
 * 播放指定消息的音频。
 * 如果当前有别的消息正在播放，会先暂停旧音频再切换到新消息。
 *
 * @param messageId 目标消息 id
 * @param restart 是否强制从头开始播放
 */
const playMessageAudio = async (messageId: number, restart = false) => {
  const requestId = ++audioPlayRequestId;
  const targetAudioUrl = getMessageAudioUrl(messageId);

  if (!targetAudioUrl) {
    return;
  }

  if (currentAudioMessageId.value !== null && currentAudioMessageId.value !== messageId) {
    pauseActiveMessageAudio();
  }

  isInternalAudioStateChange = true;
  currentAudioMessageId.value = messageId;
  playingAudioMessageId.value = null;

  if (messageAudio.src !== targetAudioUrl) {
    messageAudio.src = targetAudioUrl;
  }

  messageAudio.currentTime = resolvePlaybackStartTime(messageId, restart);
  try {
    await messageAudio.play();
    if (requestId === audioPlayRequestId && currentAudioMessageId.value === messageId) {
      playingAudioMessageId.value = messageId;
    }
  } finally {
    isInternalAudioStateChange = false;
  }
};

/**
 * 处理消息语音点击事件。
 * 同一条消息可以暂停后继续播放；切换到其它消息时会自动中断当前播放。
 *
 * @param messageId 被点击的消息 id
 */
const handleToggleMessageAudio = async (messageId: number) => {
  if (currentAudioMessageId.value === messageId && playingAudioMessageId.value === messageId) {
    pauseActiveMessageAudio(false);
    return;
  }

  try {
    await playMessageAudio(messageId);
  } catch {
    pauseActiveMessageAudio();
  }
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
 * 优先复用用户刚刚录下来的音频，模拟服务端返回回答语音。
 * 如果当前没有有效录音结果，再退回到静音占位音频。
 *
 * @returns 一次完整的 mock 返回数据
 */
const buildMockResponse = async (): Promise<MockResponse> => {
  const randomIndex = Math.floor(Math.random() * mockConversationSeeds.length);
  const seed = mockConversationSeeds[randomIndex];
  const responseAudioBlob = audioBlob.value ?? createSilentWavBlob();
  const audioUrl = registerAudioUrl(URL.createObjectURL(responseAudioBlob));
  const assistantAudio = await createAudioMessagePayload(responseAudioBlob, audioUrl);

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
  void playMessageAudio(assistantMessage.id, true).catch(() => {
    pauseActiveMessageAudio();
  });
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
     * 当前 mock 仅以“录音已完成”为前提触发返回。
     * 真实接后端时，这里可以直接把 hook 暴露的 `audioBlob`、`pcmBuffer` 上传给服务端。
     */
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

  pauseActiveMessageAudio();

  try {
    await startRecording();
  } catch {
    window.alert(
      isDeviceAvailable.value
        ? '录音初始化失败，请稍后重试。'
        : '无法访问麦克风，请检查浏览器录音权限。'
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
  pauseActiveMessageAudio();
  messageAudio.src = '';
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
  display: flex;
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
  display: flex;
  flex: 2;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid rgb(109 132 198 / 12%);
}

:deep(.operation-column) {
  flex: 1;
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
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

:deep(.message-list) {
  flex: 1;
}

:deep(.input-panel) {
  flex: 0 0 320px;
}
</style>
