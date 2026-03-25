/**
 * 对话消息的发送方。
 * `user` 表示用户侧消息，`assistant` 表示服务端返回消息。
 */
export type MessageRole = 'user' | 'assistant';

/**
 * 消息当前的渲染状态。
 * 用于驱动流式输出、待转译、已完成等界面文案。
 */
export type MessageStatus = 'pending' | 'done' | 'streaming';

/**
 * 消息内容类型。
 * `text` 用于普通文本消息，`audio` 用于附带语音播放能力的消息。
 */
export type MessageKind = 'text' | 'audio';

/**
 * 语音消息渲染所需的音频信息。
 * `url` 用于播放，`duration` 用于显示时长，`bars` 用于渲染波形条。
 */
export interface AudioMessagePayload {
  url: string
  duration: number
  bars: number[]
}

/**
 * 对话区单条消息的统一结构。
 * 这个类型同时承载文本消息、流式消息和附带语音的消息。
 */
export interface ChatMessage {
  id: number
  role: MessageRole
  kind?: MessageKind
  content: string
  displayLength?: number
  status: MessageStatus
  statusText: string
  audio?: AudioMessagePayload
  autoPlayAudio?: boolean
}

/**
 * mock 服务端返回的数据结构。
 * 当前用于模拟一次性返回用户转译文本、服务端回复文本以及服务端语音。
 */
export interface MockResponse {
  userText: string
  assistantText: string
  audioUrl: string
  assistantAudio: AudioMessagePayload
}
