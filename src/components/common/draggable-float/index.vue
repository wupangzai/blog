<template>
  <div
    v-if="props.visible"
    ref="floatRef"
    class="draggable-float"
    :class="{ 'is-dragging': isDragging }"
    :style="floatStyle"
    @pointerdown="onPointerDown"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import {
  type CSSProperties,
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import type { Edge } from './type';
import {
  getAxisLimit,
  getContainerElement,
  getContainerRect,
  getFloatSize,
  getNearestEdgePosition,
  getPositionByEdge,
  getStoredPosition,
  setStoredPosition,
} from './utils';
import type { DraggableFloatStoredPosition, EdgePosition } from './type';

/**
 * 悬浮组件对外可配置参数。
 */

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    storageKey?: string;
    container?: string | HTMLElement | null;
    zIndex?: number;
    initialEdge?: Edge;
    initialOffset?: number;
    transitionDuration?: number;
    glowColor?: string;
    glowSize?: number;
    glowOpacity?: number;
    dragScale?: number;
  }>(),
  {
    visible: true,
    storageKey: 'draggable-float-position',
    zIndex: 1000,
    initialEdge: 'right',
    initialOffset: 0.38,
    transitionDuration: 180,
    glowColor: 'rgba(255, 196, 61, 1)',
    glowSize: 22,
    glowOpacity: 0.4,
    dragScale: 1.08,
  }
);

// 悬浮节点本身，用于读取尺寸和绑定 pointer capture。
const floatRef = ref<HTMLElement | null>(null);
// 实际用于计算边界的容器节点。
const containerRef = ref<HTMLElement | null>(null);
// 悬浮节点在视口中的最终坐标。
const x = ref(0);
const y = ref(0);
// 首次完成定位前隐藏，避免闪动。
const ready = ref(false);
// 拖拽态用于控制光晕和缩放样式。
const isDragging = ref(false);
// 当前吸附边。
const currentEdge = ref<Edge>(props.initialEdge);
// 当前在吸附边上的偏移比例，范围 0 ~ 1。
const currentOffset = ref(0.5);

let resizeObserver: ResizeObserver | null = null;
let cleanupScrollListener: (() => void) | null = null;
let activePointerId: number | null = null;
// 指针按下点相对悬浮节点左上角的偏移量。
let pointerDeltaX = 0;
let pointerDeltaY = 0;

/**
 * 规范化初始偏移，避免传入越界值。
 */
const normalizedInitialOffset = computed(() => Math.min(Math.max(props.initialOffset, 0), 1));

/**
 * 当前组件用于持久化位置的 localStorage key。
 */
const storageKey = computed(() => props.storageKey.trim());

/**
 * 悬浮节点最终样式。
 * `transformOrigin` 会跟随当前吸附边变化，保证缩放只朝容器内部扩散。
 */
const floatStyle = computed<CSSProperties>(() => ({
  left: `${x.value}px`,
  top: `${y.value}px`,
  zIndex: props.zIndex,
  visibility: ready.value ? 'visible' : 'hidden',
  transformOrigin:
    currentEdge.value === 'top'
      ? 'center top'
      : currentEdge.value === 'right'
        ? 'right center'
        : currentEdge.value === 'bottom'
          ? 'center bottom'
          : 'left center',
  '--drag-transition-duration': `${props.transitionDuration}ms`,
  '--drag-glow-color': props.glowColor,
  '--drag-glow-size': `${props.glowSize}px`,
  '--drag-glow-opacity': `${props.glowOpacity}`,
  '--drag-scale': `${props.dragScale}`,
}));

/**
/**
 * 应用吸附边和偏移比例，同时同步当前状态。
 */
const applyEdgePosition = (edge: Edge, offset: number) => {
  const safeOffset = Math.min(Math.max(offset, 0), 1);
  const containerRect = getContainerRect(containerRef.value);
  const floatSize = getFloatSize(floatRef.value);
  const axisLimit = getAxisLimit(containerRect, floatSize);
  const position = getPositionByEdge(edge, safeOffset, axisLimit);
  currentEdge.value = edge;
  currentOffset.value = safeOffset;
  x.value = position.x;
  y.value = position.y;
};

/**
 * 持久化当前吸附边和偏移比例。
 */
const persistPosition = () => {
  setStoredPosition(storageKey.value, {
    edge: currentEdge.value,
    offset: currentOffset.value,
  });
};

/**
 * 初始化组件位置。
 */
const initPosition = () => {
  const storedPosition: DraggableFloatStoredPosition | null = getStoredPosition(storageKey.value);

  if (storedPosition) {
    applyEdgePosition(storedPosition.edge, storedPosition.offset);
  } else {
    applyEdgePosition(props.initialEdge, normalizedInitialOffset.value);
  }

  ready.value = true;
};

/**
 * 处理拖拽移动，按最近边实时更新贴边位置。
 */
const handlePointerMove = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) {
    return;
  }

  const nextX = event.clientX - pointerDeltaX;
  const nextY = event.clientY - pointerDeltaY;
  const containerRect = getContainerRect(containerRef.value);
  const floatSize = getFloatSize(floatRef.value);
  const axisLimit = getAxisLimit(containerRect, floatSize);
  const { edge, offset }: EdgePosition = getNearestEdgePosition(
    nextX,
    nextY,
    currentEdge.value,
    axisLimit,
  );

  applyEdgePosition(edge, offset);
};

/**
 * 清理全局拖拽事件，避免重复绑定。
 */
const cleanupDragListeners = () => {
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerup', handlePointerUp);
  window.removeEventListener('pointercancel', handlePointerUp);
};

/**
 * 结束拖拽态并释放 pointer capture。
 */
const handlePointerUp = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) {
    return;
  }

  isDragging.value = false;
  activePointerId = null;
  floatRef.value?.releasePointerCapture(event.pointerId);
  cleanupDragListeners();
  persistPosition();
};

/**
 * 进入拖拽态，记录指针相对组件左上角的偏移，保证拖动过程不跳变。
 */
const onPointerDown = (event: PointerEvent) => {
  if (!floatRef.value) {
    return;
  }

  const rect = floatRef.value.getBoundingClientRect();
  activePointerId = event.pointerId;
  isDragging.value = true;
  pointerDeltaX = event.clientX - rect.left;
  pointerDeltaY = event.clientY - rect.top;

  floatRef.value.setPointerCapture(event.pointerId);

  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerUp);
};

/**
 * 当容器尺寸或滚动位置变化时，按当前吸附边重新计算组件位置。
 */
const refreshPosition = () => {
  if (!ready.value) {
    return;
  }

  applyEdgePosition(currentEdge.value, currentOffset.value);
};

/**
 * 绑定容器相关的 resize / scroll 监听，保证边界变化后位置仍然正确。
 */
const attachContainerListeners = () => {
  cleanupScrollListener?.();
  resizeObserver?.disconnect();

  const target = containerRef.value;
  if (!target) {
    return;
  }

  resizeObserver = new ResizeObserver(refreshPosition);
  resizeObserver.observe(target);

  const scrollTarget: HTMLElement | Window =
    target === document.body || target === document.documentElement ? window : target;

  scrollTarget.addEventListener('scroll', refreshPosition, { passive: true });
  window.addEventListener('resize', refreshPosition, { passive: true });

  cleanupScrollListener = () => {
    scrollTarget.removeEventListener('scroll', refreshPosition);
    window.removeEventListener('resize', refreshPosition);
  };
};

/**
 * 解析容器并同步监听器。
 */
const resolveContainer = async () => {
  if (!props.visible) {
    return;
  }

  await nextTick();
  containerRef.value = getContainerElement(props.container, floatRef.value);
  attachContainerListeners();

  if (!ready.value) {
    initPosition();
    return;
  }

  refreshPosition();
};

watch(
  () => props.container,
  () => {
    void resolveContainer();
  }
);

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      isDragging.value = false;
      activePointerId = null;
      cleanupDragListeners();
      cleanupScrollListener?.();
      cleanupScrollListener = null;
      resizeObserver?.disconnect();
      resizeObserver = null;
      return;
    }

    void resolveContainer();
  }
);

watch(
  () => props.storageKey,
  () => {
    if (!props.visible) {
      return;
    }

    ready.value = false;
    void resolveContainer();
  }
);

watch(
  () => [props.initialEdge, normalizedInitialOffset.value] as const,
  ([edge, offset]) => {
    currentEdge.value = edge;
    currentOffset.value = offset;
    refreshPosition();
  }
);

onMounted(() => {
  currentOffset.value = normalizedInitialOffset.value;
  void resolveContainer();
});

onBeforeUnmount(() => {
  cleanupDragListeners();
  cleanupScrollListener?.();
  resizeObserver?.disconnect();
});
</script>

<style scoped lang="less">
.draggable-float {
  position: fixed;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
  touch-action: none;
  transition:
    transform var(--drag-transition-duration) ease,
    filter var(--drag-transition-duration) ease,
    box-shadow var(--drag-transition-duration) ease;
  will-change: left, top, transform, filter;
}

.draggable-float::after {
  position: absolute;
  inset: calc(var(--drag-glow-size) * -0.35);
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--drag-glow-color) 100%, transparent 0%) 0%,
    transparent 72%
  );
  opacity: 0;
  filter: blur(var(--drag-glow-size));
  content: '';
  transition:
    opacity var(--drag-transition-duration) ease,
    transform var(--drag-transition-duration) ease;
}

.draggable-float.is-dragging {
  cursor: grabbing;
  transform: scale(var(--drag-scale));
}

.draggable-float.is-dragging::after {
  opacity: var(--drag-glow-opacity);
  transform: scale(1.08);
}
</style>
