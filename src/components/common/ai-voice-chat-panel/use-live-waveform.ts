import { onBeforeUnmount, ref } from 'vue';

/** 波形条最小高度，确保静音时仍保留一条细线。 */
const MIN_BAR_HEIGHT = 8;
/** 波形条最大高度，避免说话时柱状图无限拉高。 */
const MAX_BAR_HEIGHT = 76;
/** 平均振幅低于该阈值时视为当前没有明显语音输入。 */
const SILENCE_THRESHOLD = 0.006;
/** 峰值振幅阈值，用于辅助 RMS 判断是否有说话声。 */
const PEAK_THRESHOLD = 0.02;
/** 浏览器刚释放设备时的重试间隔序列，单位毫秒。 */
const DEVICE_RETRY_DELAYS = [180, 320, 520, 820];
/** 主动释放资源后等待浏览器回收设备的缓冲时间。 */
const RELEASE_SETTLE_DELAY = 160;
/** 需要尽量规避的虚拟麦克风特征。 */
const VIRTUAL_DEVICE_PATTERNS = [
  /steam streaming microphone/i,
  /virtual/i,
  /stereo mix/i,
  /mixage st.?.?r.?o/i,
];
/** PCM 采样转为 16 bit 整型时的最大幅值。 */
const PCM_MAX_VALUE = 32767;

/** AudioWorklet 处理器名称。 */
const WORKLET_NAME = 'live-waveform-processor';
/** 用于实时获取时域采样数据的 worklet 脚本文本。 */
const WORKLET_SOURCE = `
class LiveWaveformProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    const channel = input && input[0];

    if (!channel || channel.length === 0) {
      this.port.postMessage([]);
      return true;
    }

    this.port.postMessage(Array.from(channel));
    return true;
  }
}

registerProcessor('${WORKLET_NAME}', LiveWaveformProcessor);
`;

/**
 * 简单等待工具。
 *
 * @param duration 等待时长，单位毫秒
 * @returns 等待完成的 Promise
 */
const wait = (duration: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });

/**
 * 创建静音状态下的默认波形数组。
 *
 * @param barCount 波形条数量
 * @returns 所有柱条都为最小高度的数组
 */
const createIdleBars = (barCount: number) =>
  Array.from({ length: barCount }, () => MIN_BAR_HEIGHT);

/**
 * 将 Float32 PCM 采样转换为界面可直接使用的柱状高度。
 *
 * @param samples 当前帧的浮点采样数据
 * @param barCount 目标波形条数量
 * @returns 对应每一根波形柱的高度数组
 */
const buildBarsFromSamples = (samples: Float32Array, barCount: number) => {
  const step = Math.max(1, Math.floor(samples.length / barCount));

  return Array.from({ length: barCount }, (_, index) => {
    const start = index * step;
    const end = Math.min(start + step, samples.length);

    if (start >= end) {
      return MIN_BAR_HEIGHT;
    }

    let sum = 0;

    for (let cursor = start; cursor < end; cursor += 1) {
      const sample = samples[cursor] ?? 0;
      sum += sample * sample;
    }

    const rms = Math.sqrt(sum / (end - start));
    const normalized = Math.min(rms * 14, 1);
    return MIN_BAR_HEIGHT + normalized * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);
  });
};

/**
 * 计算一帧采样数据的平均振幅。
 *
 * @param samples 当前帧的浮点采样数据
 * @returns 0~1 范围内的 RMS 值
 */
const calculateAverageRms = (samples: Float32Array) => {
  if (samples.length === 0) {
    return 0;
  }

  let sum = 0;

  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index] ?? 0;
    sum += sample * sample;
  }

  return Math.sqrt(sum / samples.length);
};

/**
 * 判断设备标签是否属于虚拟麦克风。
 *
 * @param label 浏览器返回的设备标签
 * @returns 当前设备是否应被视为虚拟输入
 */
const isVirtualAudioInputLabel = (label: string) =>
  VIRTUAL_DEVICE_PATTERNS.some((pattern) => pattern.test(label));

/**
 * 判断当前设备访问错误是否值得自动重试。
 *
 * @param error 捕获到的错误对象
 * @returns 是否属于常见的可重试设备错误
 */
const shouldRetryMediaAccess = (error: unknown) =>
  error instanceof DOMException &&
  ['AbortError', 'NotReadableError', 'InvalidStateError'].includes(error.name);

/**
 * 停止一个媒体流上的所有轨道。
 *
 * @param targetStream 需要关闭的媒体流
 */
const stopStreamTracks = (targetStream: MediaStream | null) => {
  targetStream?.getTracks().forEach((track) => track.stop());
};

/**
 * 将 Float32 PCM 采样压缩为 Int16 PCM。
 * 后端做语音识别时通常更适合直接接收 16 bit 整型 PCM 数据。
 *
 * @param samples 当前帧浮点采样
 * @returns 对应的 Int16 PCM 数据
 */
const convertSamplesToInt16 = (samples: Float32Array) => {
  const result = new Int16Array(samples.length);

  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index] ?? 0));
    result[index] = sample < 0 ? Math.round(sample * 32768) : Math.round(sample * PCM_MAX_VALUE);
  }

  return result;
};

/**
 * 合并多段 Int16 PCM 数据。
 *
 * @param chunks 分段缓存的 PCM 数据
 * @returns 一个完整的 Int16 PCM 缓冲区
 */
const mergePcmChunks = (chunks: Int16Array[]) => {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Int16Array(totalLength);
  let offset = 0;

  chunks.forEach((chunk) => {
    merged.set(chunk, offset);
    offset += chunk.length;
  });

  return merged;
};

/** 动态创建的 worklet 脚本地址，整个页面生命周期内复用。 */
let workletModuleUrl: string | null = null;
/** 已确认可用的真实麦克风设备 id，用于减少重复选择错误设备。 */
let preferredDeviceId = '';

/**
 * 为当前 AudioContext 注入 worklet 模块。
 * 每个新的 AudioContext 都必须重新 addModule。
 *
 * @param audioContext 当前录音会话的音频上下文
 */
const ensureWorkletModule = async (audioContext: AudioContext) => {
  if (!workletModuleUrl) {
    workletModuleUrl = URL.createObjectURL(
      new Blob([WORKLET_SOURCE], { type: 'application/javascript' }),
    );
  }

  await audioContext.audioWorklet.addModule(workletModuleUrl);
};

/**
 * 按指定设备申请一条音频流。
 *
 * @param deviceId 指定的真实设备 id；不传时让浏览器使用当前默认设备
 * @returns 浏览器返回的音频流
 */
const requestAudioStream = (deviceId?: string) =>
  navigator.mediaDevices.getUserMedia({
    audio: {
      ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
      autoGainControl: false,
      noiseSuppression: false,
      echoCancellation: false,
    },
  });

/**
 * 带重试机制的设备申请封装。
 *
 * @param deviceId 指定设备 id
 * @returns 成功获取到的音频流
 */
const requestAudioStreamWithRetry = async (deviceId?: string) => {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= DEVICE_RETRY_DELAYS.length; attempt += 1) {
    try {
      return await requestAudioStream(deviceId);
    } catch (error) {
      lastError = error;

      if (!shouldRetryMediaAccess(error) || attempt === DEVICE_RETRY_DELAYS.length) {
        throw error;
      }

      await wait(DEVICE_RETRY_DELAYS[attempt] ?? 0);
    }
  }

  throw lastError;
};

/**
 * 解析并返回一条真实可用的麦克风流。
 * 首次会自动避开虚拟麦克风；之后优先直连上一次确认可用的设备。
 *
 * @returns 本次录音应使用的真实麦克风流
 */
const resolvePreferredAudioStream = async () => {
  if (preferredDeviceId) {
    try {
      return await requestAudioStreamWithRetry(preferredDeviceId);
    } catch {
      preferredDeviceId = '';
    }
  }

  const initialStream = await requestAudioStreamWithRetry();
  const [initialTrack] = initialStream.getAudioTracks();
  const initialLabel = initialTrack?.label ?? '';
  const initialDeviceId = initialTrack?.getSettings().deviceId ?? '';

  if (initialLabel && !isVirtualAudioInputLabel(initialLabel) && initialDeviceId) {
    preferredDeviceId = initialDeviceId;
    return initialStream;
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  const preferredDevice = devices.find(
    (device) =>
      device.kind === 'audioinput' &&
      device.deviceId &&
      device.deviceId !== initialDeviceId &&
      !isVirtualAudioInputLabel(device.label),
  );

  if (!preferredDevice) {
    if (initialDeviceId) {
      preferredDeviceId = initialDeviceId;
    }
    return initialStream;
  }

  stopStreamTracks(initialStream);
  await wait(RELEASE_SETTLE_DELAY);
  preferredDeviceId = preferredDevice.deviceId;
  return requestAudioStreamWithRetry(preferredDevice.deviceId);
};

/**
 * 统一的录音控制 hook。
 * 所有与录音设备、波形、MediaRecorder、PCM 缓冲和资源释放相关的逻辑都在这里完成。
 *
 * @param barCount RecordingModal 使用的波形柱数量
 * @returns 录音状态、录音结果以及控制录音生命周期的方法
 */
export const useLiveWaveform = (barCount = 24) => {
  /** 当前设备是否可成功访问。 */
  const isDeviceAvailable = ref(false);
  /** 当前是否正在录音。 */
  const isRecording = ref(false);
  /** 实时波形数据，直接传给 RecordingModal 使用。 */
  const bars = ref<number[]>(createIdleBars(barCount));
  /** 当前是否检测到明显语音输入，用于切换提示文案。 */
  const hasVoice = ref(false);
  /** 最新一次录音生成的 Blob。 */
  const audioBlob = ref<Blob | null>(null);
  /** 最新一次录音生成的可播放地址。 */
  const audioUrl = ref('');
  /** 最新一次录音对应的 PCM 数据，供上传语音识别使用。 */
  const pcmBuffer = ref<Int16Array | null>(null);

  /** 当前录音使用的媒体流。 */
  let stream: MediaStream | null = null;
  /** 当前录音使用的音频上下文。 */
  let audioContext: AudioContext | null = null;
  /** 媒体流输入节点。 */
  let source: MediaStreamAudioSourceNode | null = null;
  /** 0 音量输出节点，保证音频图持续运行但不外放。 */
  let sink: GainNode | null = null;
  /** 实时采样 worklet 节点。 */
  let workletNode: AudioWorkletNode | null = null;
  /** 当前录音使用的 MediaRecorder。 */
  let mediaRecorder: MediaRecorder | null = null;
  /** 浏览器录音分片缓存。 */
  let recordedChunks: Blob[] = [];
  /** 当前录音期间采集到的 PCM 数据分片。 */
  let pcmChunks: Int16Array[] = [];
  /** 停止录音后的异步清理 Promise。 */
  let stopRecordingPromise: Promise<void> | null = null;

  /**
   * 重置波形和语音检测状态。
   * 录音开始前、结束后以及手动释放资源时都会调用。
   */
  const resetWaveformState = () => {
    bars.value = createIdleBars(barCount);
    hasVoice.value = false;
  };

  /**
   * 刷新当前波形显示和说话检测状态。
   *
   * @param samples worklet 返回的一帧 Float32 采样
   */
  const updateWaveform = (samples: Float32Array) => {
    const nextBars = buildBarsFromSamples(samples, barCount);
    const averageAmplitude = calculateAverageRms(samples);
    const peakAmplitude = nextBars.length
      ? Math.max(
          ...nextBars.map((value) => (value - MIN_BAR_HEIGHT) / (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT)),
        )
      : 0;

    hasVoice.value = averageAmplitude > SILENCE_THRESHOLD || peakAmplitude > PEAK_THRESHOLD;
    bars.value = hasVoice.value ? nextBars : createIdleBars(barCount);
  };

  /**
   * 释放上一次录音产生的对象地址和结果缓存。
   * 开启新录音前会先清掉旧结果，确保外部拿到的始终是最新一次录音。
   */
  const resetRecordingResult = () => {
    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value);
    }

    audioBlob.value = null;
    audioUrl.value = '';
    pcmBuffer.value = null;
  };

  /**
   * 结束当前会话的音频图和设备占用。
   *
   * @returns 资源释放完成的 Promise
   */
  const teardownSession = async () => {
    if (workletNode) {
      workletNode.port.onmessage = null;
    }

    workletNode?.disconnect();
    source?.disconnect();
    sink?.disconnect();
    stopStreamTracks(stream);

    if (audioContext && audioContext.state !== 'closed') {
      await audioContext.close();
    }

    workletNode = null;
    source = null;
    sink = null;
    stream = null;
    audioContext = null;
    resetWaveformState();
    isRecording.value = false;
    await wait(RELEASE_SETTLE_DELAY);
  };

  /**
   * 选择当前浏览器支持的录音编码格式。
   *
   * @returns 可用于 MediaRecorder 的 mimeType；如果都不支持则返回空字符串
   */
  const getPreferredMimeType = () => {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
    ];

    return candidates.find((item) => MediaRecorder.isTypeSupported(item)) ?? '';
  };

  /**
   * 启动一次录音。
   * 该方法会申请设备、初始化 AudioWorklet、创建 MediaRecorder，并开始累积 PCM 数据。
   *
   * @returns 录音开始完成的 Promise
   */
  const startRecording = async () => {
    if (isRecording.value) {
      return;
    }

    await teardownSession();
    resetRecordingResult();
    recordedChunks = [];
    pcmChunks = [];

    stream = await resolvePreferredAudioStream();
    isDeviceAvailable.value = true;
    audioContext = new window.AudioContext();
    await audioContext.resume();
    await ensureWorkletModule(audioContext);

    source = audioContext.createMediaStreamSource(stream);
    sink = audioContext.createGain();
    sink.gain.value = 0;
    workletNode = new AudioWorkletNode(audioContext, WORKLET_NAME);

    workletNode.port.onmessage = (event: MessageEvent<number[]>) => {
      const samples = new Float32Array(event.data ?? []);

      if (samples.length === 0) {
        return;
      }

      updateWaveform(samples);

      if (isRecording.value) {
        pcmChunks.push(convertSamplesToInt16(samples));
      }
    };

    source.connect(workletNode);
    workletNode.connect(sink);
    sink.connect(audioContext.destination);

    const mimeType = getPreferredMimeType();
    mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    });

    isRecording.value = true;
    mediaRecorder.start();
  };

  /**
   * 停止当前录音。
   * 停止后会将最新录音结果写入 `audioBlob`、`audioUrl` 和 `pcmBuffer`。
   *
   * @returns 停止录音并完成结果整理的 Promise
   */
  const stopRecording = async () => {
    if (!isRecording.value) {
      return;
    }

    const currentRecorder = mediaRecorder;

    if (!currentRecorder || currentRecorder.state === 'inactive') {
      isRecording.value = false;
      pcmBuffer.value = mergePcmChunks(pcmChunks);
      await teardownSession();
      return;
    }

    stopRecordingPromise = new Promise<void>((resolve) => {
      const handleStop = async () => {
        currentRecorder.removeEventListener('stop', handleStop);

        const nextAudioBlob =
          recordedChunks.length > 0
            ? new Blob(recordedChunks, { type: currentRecorder.mimeType || 'audio/webm' })
            : null;

        audioBlob.value = nextAudioBlob;
        audioUrl.value = nextAudioBlob ? URL.createObjectURL(nextAudioBlob) : '';
        pcmBuffer.value = mergePcmChunks(pcmChunks);

        mediaRecorder = null;
        await teardownSession();
        resolve();
      };

      currentRecorder.addEventListener('stop', handleStop);
      currentRecorder.stop();
    });

    await stopRecordingPromise;
    stopRecordingPromise = null;
  };

  /**
   * 手动释放当前 hook 管理的所有资源。
   * 包括停止录音、关闭设备、清理对象地址和重置缓存，确保浏览器不再占用麦克风。
   *
   * @returns 释放完成的 Promise
   */
  const release = async () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      await stopRecording();
    } else {
      await teardownSession();
    }

    mediaRecorder = null;
    recordedChunks = [];
    pcmChunks = [];
    resetRecordingResult();
    isDeviceAvailable.value = false;
  };

  onBeforeUnmount(() => {
    void release();
  });

  return {
    isDeviceAvailable,
    isRecording,
    bars,
    hasVoice,
    startRecording,
    stopRecording,
    audioBlob,
    audioUrl,
    pcmBuffer,
    release,
  };
};
