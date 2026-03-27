# AI Voice Chat Panel 修改总结

## 本次目标

围绕 `src/components/common/ai-voice-chat-panel` 这套 AI 对话组件，完成了以下几类改造：

- 录音链路封装与稳定性修复
- 对话消息结构调整
- 服务端语音展示与统一播放控制
- 消息列表虚拟滚动接入
- 布局与组件职责整理
- 代码注释补充与无用逻辑清理

---

## 1. 录音能力重构

### 1.1 `use-live-waveform.ts` 收敛为完整录音 hook

文件：
- [src/components/common/ai-voice-chat-panel/use-live-waveform.ts](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/use-live-waveform.ts)

原先录音相关逻辑散落在 `index.vue` 中，包括：
- 麦克风申请
- `MediaRecorder`
- 波形采样
- Blob 生成
- 资源释放

现在统一收敛到 `useLiveWaveform` 中，对外暴露：

- `isDeviceAvailable`
- `isRecording`
- `bars`
- `hasVoice`
- `startRecording`
- `stopRecording`
- `audioBlob`
- `audioUrl`
- `pcmBuffer`
- `release`

### 1.2 录音 hook 内部职责

hook 内部已统一处理：

- 真实麦克风设备选择
- 虚拟麦克风规避
- `AudioWorklet` 实时波形采样
- `MediaRecorder` 音频录制
- Int16 PCM 数据缓存
- 最新录音 Blob / URL 更新
- 录音结束后的资源清理
- 组件卸载时自动释放设备

### 1.3 连续录音问题修复

修复了“录音一次后再次录音失败”的问题，关键点包括：

- 每次录音前完整释放上一次会话
- 录音停止后等待浏览器释放设备
- 每个新 `AudioContext` 都重新加载 `audioWorklet.addModule()`

---

## 2. 对话消息结构调整

文件：
- [src/components/common/ai-voice-chat-panel/types.ts](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/types.ts)

### 2.1 消息类型统一

新增/整理了以下类型：

- `MessageRole`
- `MessageStatus`
- `MessageKind`
- `AudioMessagePayload`
- `ChatMessage`
- `MockResponse`

### 2.2 当前消息规则

- 用户录音结束后，不再在对话框里显示“用户自己的语音气泡”
- 用户侧先显示一条文本占位消息：`正在发送...`
- mock 返回后，这条用户消息替换为“用户语音转译文本”
- 服务端消息展示：
  - 回答文本
  - 回答语音

---

## 3. 服务端语音展示与播放控制

### 3.1 `voice-message-bubble.vue` 改为纯 UI 组件

文件：
- [src/components/common/ai-voice-chat-panel/components/voice-message-bubble.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/voice-message-bubble.vue)

之前：
- 每条消息自己创建 `Audio`
- 组件内自己播放/暂停
- `onMounted` 自动播放

现在：
- 只负责展示语音按钮、波形柱和时长
- 只通过 `toggle` 事件通知父组件
- 不再自己持有 `Audio`
- 不再自己自动播放

### 3.2 根组件统一管理音频播放

文件：
- [src/components/common/ai-voice-chat-panel/index.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/index.vue)

现在所有消息音频统一由根组件中的单个 `Audio` 实例管理。

核心状态包括：

- `messageAudio`
- `currentAudioMessageId`
- `playingAudioMessageId`
- `audioProgressMap`
- `isInternalAudioStateChange`
- `audioPlayRequestId`

### 3.3 实现的播放行为

已支持：

- 点击消息语音播放
- 再点同一条语音暂停
- 暂停后再次点击继续播放
- 切换到别的消息时自动暂停当前音频
- 正在播放时点击录音，会先暂停当前音频
- 历史语音被虚拟滚动卸载后，滚回来仍可从上次进度继续播放
- 新的服务端消息返回时，自动抢占播放最新语音

### 3.4 播放异常修复

修复了以下问题：

- 首次点击语音要点两次才播放
- 点击播放后马上又停止
- 由于上次进度接近结尾，导致点击后立即结束

采取的修复方式包括：

- 拆分“当前绑定消息”和“真正播放中的消息”状态
- 用请求序号忽略旧播放请求的迟到事件
- 过滤内部切源触发的 `pause`
- 播放起点归一化，接近结尾时自动从头播

---

## 4. mock 语音返回策略调整

文件：
- [src/components/common/ai-voice-chat-panel/index.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/index.vue)

### 4.1 服务端语音优先复用用户录音

当前 mock 返回的服务端语音优先使用：

- 用户刚刚录下来的 `audioBlob`

如果当前没有可用录音结果，才回退到：

- `createSilentWavBlob()` 生成的静音占位音频

这样能更贴近真实“录音发给服务端，服务端再回语音”的链路。

---

## 5. 消息列表虚拟滚动

文件：
- [src/components/common/ai-voice-chat-panel/components/message-list.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/message-list.vue)
- [package.json](/d:/Code/vue-vite-template/package.json)

### 5.1 接入 `vue-virtual-scroller`

已安装依赖：

- `vue-virtual-scroller`

并在消息列表中使用：

- `DynamicScroller`
- `DynamicScrollerItem`

### 5.2 为什么要上虚拟滚动

当聊天记录很多时，如果每条消息都渲染成真实 DOM：

- 页面滚动会明显卡顿
- 浏览器内存压力变大
- 音频消息与复杂消息布局会让重排成本更高

虚拟滚动可以把真实渲染数量控制在可视区域附近，提升长对话性能。

### 5.3 slot `unknown` 类型处理

由于 `DynamicScroller` 的 slot `item` 类型推断为 `unknown`，最终采用了：

- `toMessage(rawItem)` 方案

用于在模板里收窄为 `ChatMessage`。

这是当前这套模板 + `vue-tsc` 配置下最稳定的写法之一。

---

## 6. 布局调整

文件：
- [src/components/common/ai-voice-chat-panel/index.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/index.vue)

### 6.1 根布局由 Grid 改为 Flex

根据需求，主容器不再使用 `grid`，而改为：

- 外层 `display: flex`
- 左侧聊天区 `flex: 2`
- 右侧操作区 `flex: 1`

聊天区内部也改成：

- 顶部 header
- 中间消息区 `flex: 1`
- 底部输入区固定高度

这样在虚拟滚动与内部滚动场景下更稳定。

---

## 7. 右侧操作栏调整

文件：
- [src/components/common/ai-voice-chat-panel/components/operation-panel.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/operation-panel.vue)

根据新需求，右侧操作栏：

- 去掉了“用户自己的录音回放”
- 保留服务端相关信息：
  - 最近一次用户文本
  - 最近一次服务端回复
  - 服务端音频文件
  - 当前流式速度

---

## 8. 注释与可维护性整理

本轮对以下文件补充了较完整的注释：

- [src/components/common/ai-voice-chat-panel/index.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/index.vue)
- [src/components/common/ai-voice-chat-panel/use-live-waveform.ts](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/use-live-waveform.ts)
- [src/components/common/ai-voice-chat-panel/utils.ts](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/utils.ts)
- [src/components/common/ai-voice-chat-panel/types.ts](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/types.ts)
- [src/components/common/ai-voice-chat-panel/mock-config.ts](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/mock-config.ts)
- [src/components/common/ai-voice-chat-panel/components/message-list.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/message-list.vue)
- [src/components/common/ai-voice-chat-panel/components/voice-message-bubble.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/voice-message-bubble.vue)
- [src/components/common/ai-voice-chat-panel/components/recording-modal.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/recording-modal.vue)
- [src/components/common/ai-voice-chat-panel/components/operation-panel.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/operation-panel.vue)
- [src/components/common/ai-voice-chat-panel/components/chat-input-panel.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/chat-input-panel.vue)

注释内容涵盖：

- 常量含义
- 状态变量职责
- 函数用途
- 返回值说明
- 调用时机
- 设计意图

---

## 9. 当前最终行为总结

当前这套 AI 对话组件具备这些行为：

- 点击录音后展示实时波形弹窗
- 录音结束后，用户侧先显示“正在发送...”
- mock 返回后：
  - 用户侧显示转译文本
  - 服务端侧显示文本回答
  - 服务端侧显示语音气泡
  - 服务端语音自动播放
- 历史消息很多时使用虚拟滚动优化性能
- 所有消息音频由根组件统一控制
- 录音与播放能互相正确打断
- 滚动卸载后语音进度仍可恢复

---

## 10. 本次涉及的主要文件

- [src/components/common/ai-voice-chat-panel/index.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/index.vue)
- [src/components/common/ai-voice-chat-panel/use-live-waveform.ts](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/use-live-waveform.ts)
- [src/components/common/ai-voice-chat-panel/utils.ts](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/utils.ts)
- [src/components/common/ai-voice-chat-panel/types.ts](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/types.ts)
- [src/components/common/ai-voice-chat-panel/mock-config.ts](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/mock-config.ts)
- [src/components/common/ai-voice-chat-panel/components/message-list.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/message-list.vue)
- [src/components/common/ai-voice-chat-panel/components/voice-message-bubble.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/voice-message-bubble.vue)
- [src/components/common/ai-voice-chat-panel/components/recording-modal.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/recording-modal.vue)
- [src/components/common/ai-voice-chat-panel/components/operation-panel.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/operation-panel.vue)
- [src/components/common/ai-voice-chat-panel/components/chat-input-panel.vue](/d:/Code/vue-vite-template/src/components/common/ai-voice-chat-panel/components/chat-input-panel.vue)
- [package.json](/d:/Code/vue-vite-template/package.json)

