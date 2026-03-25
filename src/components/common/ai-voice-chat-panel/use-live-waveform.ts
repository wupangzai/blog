import { onBeforeUnmount, ref } from 'vue';

/** 波形条最小高度，确保静音时仍保留一条线的视觉存在感。 */
const MIN_BAR_HEIGHT = 8;
/** 波形条最大高度，用于限制录音时的视觉波动上限。 */
const MAX_BAR_HEIGHT = 76;
/** 低于该均方根阈值时，视为没有明显语音输入。 */
const SILENCE_THRESHOLD = 0.006;
/** 波形峰值兜底阈值，用于补充 RMS 判断。 */
const PEAK_THRESHOLD = 0.02;
/** 连续申请麦克风失败时的重试间隔，单位毫秒。 */
const DEVICE_RETRY_DELAYS = [180, 320, 520, 820];
/** 停止旧设备后等待浏览器回收资源的缓冲时间。 */
const RELEASE_SETTLE_DELAY = 160;
/** 需要规避的虚拟输入设备特征。 */
const VIRTUAL_DEVICE_PATTERNS = [
  /steam streaming microphone/i,
  /virtual/i,
  /stereo mix/i,
  /mixage st.?.?r.?o/i,
];

/** AudioWorklet 处理器名称，创建节点时会用到。 */
const WORKLET_NAME = 'live-waveform-processor';
/** 内联 worklet 脚本，用于在音频线程里持续读取时域采样数据。 */
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
 * 异步等待一小段时间。
 * 用于设备释放后的时序缓冲以及 `getUserMedia` 的重试退避。
 *
 * @param duration 等待时长，单位毫秒
 * @returns 等待完成的 Promise
 */
const wait = (duration: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });

/**
 * 生成静音状态下的默认波形条。
 *
 * @param barCount 需要的波形条数量
 * @returns 仅包含最小高度的波形数组
 */
const createIdleBars = (barCount: number) =>
  Array.from({ length: barCount }, () => MIN_BAR_HEIGHT);

/**
 * 将原始采样点转换成界面展示用的波形高度。
 *
 * @param samples worklet 返回的时域采样数据
 * @param barCount 目标波形条数量
 * @returns 已映射到像素高度区间的波形数组
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
 * 计算整段采样数据的 RMS 强度。
 * 该值用于判断当前是否存在明确的语音输入。
 *
 * @param samples 原始采样数据
 * @returns 0~1 范围内的平均振幅强度
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
 * 判断设备标签是否属于虚拟输入。
 * 用来规避 Steam Streaming Microphone 这类会导致空采样的数据源。
 *
 * @param label 设备标签
 * @returns 是否应被视为虚拟输入设备
 */
const isVirtualAudioInputLabel = (label: string) =>
  VIRTUAL_DEVICE_PATTERNS.some((pattern) => pattern.test(label));

/**
 * 判断当前错误是否值得自动重试。
 * 这些错误大多发生在浏览器尚未完全释放上一次录音设备时。
 *
 * @param error 捕获到的异常对象
 * @returns 是否应自动重试 `getUserMedia`
 */
const shouldRetryMediaAccess = (error: unknown) =>
  error instanceof DOMException &&
  ['AbortError', 'NotReadableError', 'InvalidStateError'].includes(error.name);

/**
 * 安全停止一个 MediaStream 的全部 track。
 *
 * @param targetStream 需要释放的媒体流
 */
const stopStreamTracks = (targetStream: MediaStream | null) => {
  targetStream?.getTracks().forEach((track) => track.stop());
};

/** 动态生成的 worklet 模块地址，会在整个页面生命周期内复用。 */
let workletModuleUrl: string | null = null;
/** 已选择并验证过的真实麦克风设备 id，用于后续快速直连。 */
let preferredDeviceId = '';

/**
 * 确保当前 AudioContext 已加载 worklet 模块。
 * 每个新的 AudioContext 都需要单独执行一次 `addModule()`。
 *
 * @param audioContext 本次录音会话的音频上下文
 * @returns worklet 模块加载完成的 Promise
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
 * 按指定设备发起麦克风请求。
 *
 * @param deviceId 可选的真实设备 id，不传时让浏览器自行选择默认设备
 * @returns 浏览器返回的音频媒体流
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
 * 带重试能力的麦克风请求封装。
 * 用于兜底浏览器在设备刚释放后的短暂不可用状态。
 *
 * @param deviceId 目标设备 id
 * @returns 成功申请到的音频媒体流
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
 * 获取本次录音应使用的真实麦克风流。
 * 首次调用时会自动规避虚拟设备，并缓存真实设备 id；后续优先直连缓存设备。
 *
 * @returns 可直接用于录音和波形分析的麦克风流
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

  try {
    return await requestAudioStreamWithRetry(preferredDevice.deviceId);
  } catch (error) {
    preferredDeviceId = '';
    throw error;
  }
};

/**
 * 录音波形 composable。
 * 负责申请麦克风、驱动录音弹窗里的实时波形、并对外暴露当前录音会话流。
 *
 * @param barCount 录音弹窗中波形条数量
 * @returns 波形状态、语音检测状态以及录音会话生命周期方法
 */
export const useLiveWaveform = (barCount = 24) => {
  /** 实时波形条数据，直接绑定到录音弹窗。 */
  const bars = ref<number[]>(createIdleBars(barCount));
  /** 当前是否检测到明显语音输入，用于切换录音提示文案。 */
  const hasVoice = ref(false);

  /** 当前录音会话对应的媒体流，只在录音期间存在。 */
  let stream: MediaStream | null = null;
  /** 当前录音会话的音频上下文，用于承载 worklet。 */
  let audioContext: AudioContext | null = null;
  /** 媒体流到音频图的输入节点。 */
  let source: MediaStreamAudioSourceNode | null = null;
  /** 0 音量输出节点，用于保持图运行但不把声音外放。 */
  let sink: GainNode | null = null;
  /** 负责实时上报采样数据的 worklet 节点。 */
  let workletNode: AudioWorkletNode | null = null;

  /**
   * 重置录音弹窗显示状态。
   * 在录音开始前和录音结束后都需要调用。
   */
  const resetState = () => {
    bars.value = createIdleBars(barCount);
    hasVoice.value = false;
  };

  /**
   * 根据最新采样数据刷新波形和说话状态。
   *
   * @param samples 当前一帧音频采样
   */
  const updateLevels = (samples: Float32Array) => {
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
   * 释放当前录音会话相关的所有资源。
   * 它会关闭 worklet、音频上下文和本次媒体流，并在结束后等待浏览器完成设备回收。
   *
   * @returns 释放完成的 Promise
   */
  const release = async () => {
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
    stream = null;
    audioContext = null;
    source = null;
    sink = null;
    resetState();
    await wait(RELEASE_SETTLE_DELAY);
  };

  /**
   * 开始一次新的录音波形会话。
   * 该方法会先完整释放旧会话，再申请真实麦克风，并构建 worklet 采样链。
   *
   * @returns 初始化完成的 Promise
   */
  const start = async () => {
    await release();

    stream = await resolvePreferredAudioStream();
    audioContext = new window.AudioContext();
    await audioContext.resume();
    await ensureWorkletModule(audioContext);

    source = audioContext.createMediaStreamSource(stream);
    sink = audioContext.createGain();
    sink.gain.value = 0;
    workletNode = new AudioWorkletNode(audioContext, WORKLET_NAME);

    workletNode.port.onmessage = (event: MessageEvent<number[]>) => {
      const samples = new Float32Array(event.data ?? []);

      if (samples.length > 0) {
        updateLevels(samples);
      }
    };

    source.connect(workletNode);
    workletNode.connect(sink);
    sink.connect(audioContext.destination);
  };

  onBeforeUnmount(() => {
    void release();
  });

  return {
    bars,
    hasVoice,
    /**
     * 获取当前录音会话的媒体流。
     * 供外层 `MediaRecorder` 直接复用同一条流进行录音。
     */
    getStream: () => stream,
    start,
    /** 停止当前会话，别名保留给组件层直接调用。 */
    stop: release,
    /** 显式释放录音资源，组件卸载时会使用。 */
    release,
  };
};
