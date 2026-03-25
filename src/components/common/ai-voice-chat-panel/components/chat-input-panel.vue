<template>
  <div class="input-panel">
    <div class="input-hint">
      <span>语音输入会先显示“正在转译”，服务端返回后替换为真实文本。</span>
    </div>
    <textarea
      :value="draftText"
      class="text-input"
      placeholder="可直接输入内容，或点击下方录音按钮体验 mock 语音对话。"
      @input="handleDraftInput"
    />
    <div class="input-actions">
      <button class="action-btn secondary" @click="emit('send-text')">发送文字</button>
      <button class="action-btn primary" @click="emit('start-recording')">点击录音</button>
    </div>
  </div>
</template>

<script setup lang="ts">
/** 输入区只接收当前草稿文本，由父组件负责保存真实状态。 */
defineProps<{
  draftText: string;
}>();

/**
 * 输入区对外事件：
 * `update:draftText` 同步输入框内容，
 * `send-text` 发送文字消息，
 * `start-recording` 打开录音流程。
 */
const emit = defineEmits<{
  'update:draftText': [value: string]
  'send-text': []
  'start-recording': []
}>();

/**
 * 处理输入框内容变化。
 * 模板里不直接写 TS 类型断言，避免 eslint 的 `vue/no-parsing-error`。
 *
 * @param event 原生输入事件
 */
const handleDraftInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement | null;
  emit('update:draftText', target?.value ?? '');
};
</script>

<style scoped lang="less">
.input-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  min-height: 0;
  padding: 24px 28px 30px;
  background: linear-gradient(180deg, rgb(255 255 255 / 10%), rgb(255 255 255 / 70%));
  border-top: 1px solid rgb(109 132 198 / 12%);
}

.input-hint {
  font-size: 13px;
  color: #657497;
}

.text-input {
  flex: 1;
  min-height: 0;
  padding: 16px 18px;
  font-size: 15px;
  color: #1d2c4d;
  resize: none;
  background: rgb(255 255 255 / 92%);
  border: 1px solid rgb(108 135 204 / 18%);
  border-radius: 18px;
  outline: none;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 60%);
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.action-btn {
  min-width: 128px;
  padding: 12px 20px;
  font-size: 14px;
  color: #1b2a48;
  cursor: pointer;
  border: none;
  border-radius: 999px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn.primary {
  color: #fff;
  background: linear-gradient(135deg, #507ae0 0%, #6a8ee9 100%);
  box-shadow: 0 12px 22px rgb(80 122 224 / 30%);
}

.action-btn.secondary {
  background: #e9efff;
}
</style>
