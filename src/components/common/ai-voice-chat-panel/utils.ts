import type { AudioMessagePayload, ChatMessage } from './types';

/**
 * 获取消息当前应该展示的文本内容。
 * 服务端消息在流式输出阶段只展示一部分字符，其它情况直接展示完整内容。
 *
 * @param message 当前要渲染的消息对象
 * @returns 应该显示在气泡中的文本
 */
export const getDisplayContent = (message: ChatMessage) => {
  if (message.role === 'assistant' && message.status === 'streaming') {
    return message.content.slice(0, message.displayLength ?? 0);
  }

  return message.content;
};

/**
 * 创建一段静音 wav 音频 blob。
 * 当前主要用于 mock 服务端返回的音频文件展示与语音气泡波形生成。
 *
 * @returns 静音 wav 的二进制对象
 */
export const createSilentWavBlob = () => {
  /** wav 采样率，静音 mock 对应 8kHz 即可满足演示需求。 */
  const sampleRate = 8000;
  /** 静音音频时长，当前生成 1 秒用于占位演示。 */
  const durationSeconds = 1;
  /** 音频总采样点数量。 */
  const sampleCount = sampleRate * durationSeconds;
  /** 16 bit PCM 每个采样点占 2 个字节。 */
  const bytesPerSample = 2;
  /** PCM 数据区域总字节数。 */
  const dataSize = sampleCount * bytesPerSample;
  /** 44 字节 wav 头 + 音频数据区。 */
  const buffer = new ArrayBuffer(44 + dataSize);
  /** DataView 用于按 wav 格式逐段写入头信息。 */
  const view = new DataView(buffer);

  /**
   * 向 wav 头部写入 ASCII 字符串。
   *
   * @param offset 写入起始位置
   * @param value 要写入的字符串值
   */
  const writeString = (offset: number, value: string) => {
    Array.from(value).forEach((char, index) => {
      view.setUint8(offset + index, char.charCodeAt(0));
    });
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  return new Blob([buffer], { type: 'audio/wav' });
};

/**
 * 创建静音 wav 音频对象地址。
 * 适用于 mock 服务端返回音频文件时的快速占位展示。
 *
 * @returns 可直接赋给 `<audio src>` 的对象地址
 */
export const createSilentWavUrl = () => URL.createObjectURL(createSilentWavBlob());

/**
 * 读取音频文件元数据中的时长。
 * 失败时会返回 0，供上层兜底处理。
 *
 * @param audioUrl 音频对象地址
 * @returns 音频时长，单位为秒
 */
export const getAudioDuration = (audioUrl: string) =>
  new Promise<number>((resolve) => {
    /** 临时 audio 元素，仅用于读取 metadata。 */
    const audio = new Audio();

    audio.preload = 'metadata';
    audio.src = audioUrl;
    audio.onloadedmetadata = () => {
      resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    audio.onerror = () => resolve(0);
  });

/**
 * 基于录音文件解码后的波形数据构建语音气泡竖条高度。
 * 返回值范围为 0~1，供界面层按比例映射成最终高度。
 *
 * @param blob 原始录音文件
 * @param barCount 目标波形条数量
 * @returns 可用于语音气泡展示的波形比例数组
 */
export const buildAudioBars = async (blob: Blob, barCount = 32) => {
  /**
   * 兼容 Safari 的 AudioContext 构造器读取方式。
   * 如果当前环境不支持，则返回一组默认波形占位。
   */
  const AudioContextConstructor = window.AudioContext || (window as typeof window & {
    webkitAudioContext?: typeof AudioContext
  }).webkitAudioContext;

  if (!AudioContextConstructor) {
    return Array.from({ length: barCount }, () => 0.38);
  }

  /** 独立上下文仅用于离线解析音频文件波形。 */
  const audioContext = new AudioContextConstructor();

  try {
    /** 读取录音文件二进制内容。 */
    const arrayBuffer = await blob.arrayBuffer();
    /** 解码音频，便于拿到采样点数据。 */
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    /** 当前只取第一声道作为波形展示依据。 */
    const rawData = audioBuffer.getChannelData(0);
    /** 把整段音频均匀切成若干段，对应界面里的竖线数量。 */
    const step = Math.max(1, Math.floor(rawData.length / barCount));
    const bars = Array.from({ length: barCount }, (_, index) => {
      const start = index * step;
      const end = Math.min(start + step, rawData.length);

      if (start >= end) {
        return 0.32;
      }

      let peak = 0;

      for (let cursor = start; cursor < end; cursor += 1) {
        const sample = Math.abs(rawData[cursor] ?? 0);
        if (sample > peak) {
          peak = sample;
        }
      }

      /** 对每一段取峰值，再限制最小/最大范围，避免视觉上过短或过高。 */
      return Math.min(Math.max(peak * 1.8, 0.18), 1);
    });

    return bars.some((value) => value > 0.2)
      ? bars
      : Array.from({ length: barCount }, () => 0.38);
  } catch {
    return Array.from({ length: barCount }, () => 0.38);
  } finally {
    if (audioContext.state !== 'closed') {
      await audioContext.close();
    }
  }
};

/**
 * 组合语音消息渲染所需的完整结构。
 * 上层在录音结束后调用它，把 blob 转成可播放地址、时长和波形条数据。
 *
 * @param blob 原始录音文件
 * @param audioUrl 对象地址
 * @returns 可直接挂到消息对象上的音频渲染数据
 */
export const createAudioMessagePayload = async (
  blob: Blob,
  audioUrl: string,
): Promise<AudioMessagePayload> => {
  /** 时长和波形条可以并行计算，减少录音结束后的等待时间。 */
  const [duration, bars] = await Promise.all([
    getAudioDuration(audioUrl),
    buildAudioBars(blob),
  ]);

  return {
    url: audioUrl,
    duration: Math.max(1, Math.round(duration)),
    bars,
  };
};
