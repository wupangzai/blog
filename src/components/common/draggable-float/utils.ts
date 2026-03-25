import type {
  AxisLimit,
  DraggableFloatStoredPosition,
  Edge,
  EdgePosition,
  Rect,
  Size,
} from './type';

/**
 * 解析用户传入的容器配置。
 * 未传时默认使用当前组件的父元素作为边界容器。
 */
export const getContainerElement = (
  container: string | HTMLElement | null | undefined,
  floatElement: HTMLElement | null,
): HTMLElement | null => {
  if (container instanceof HTMLElement) {
    return container;
  }

  if (typeof container === 'string') {
    return document.querySelector(container);
  }

  return floatElement?.parentElement ?? null;
};

/**
 * 获取容器在视口中的矩形区域。
 * 如果没有显式容器，则退化为整个窗口。
 */
export const getContainerRect = (target: HTMLElement | null): Rect => {
  if (!target) {
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const rect = target.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
};

/**
 * 获取悬浮节点当前尺寸。
 */
export const getFloatSize = (floatElement: HTMLElement | null): Size => {
  const rect = floatElement?.getBoundingClientRect();
  return {
    width: rect?.width ?? 0,
    height: rect?.height ?? 0,
  };
};

/**
 * 计算悬浮节点在容器中的移动边界。
 */
export const getAxisLimit = (containerRect: Rect, floatSize: Size): AxisLimit => ({
  minX: containerRect.left,
  maxX: Math.max(containerRect.left, containerRect.right - floatSize.width),
  minY: containerRect.top,
  maxY: Math.max(containerRect.top, containerRect.bottom - floatSize.height),
});

/**
 * 根据边和偏移比例计算悬浮节点最终坐标。
 */
export const getPositionByEdge = (edge: Edge, offset: number, axisLimit: AxisLimit) => {
  const { minX, maxX, minY, maxY } = axisLimit;
  const safeOffset = Math.min(Math.max(offset, 0), 1);

  switch (edge) {
    case 'top':
      return { x: minX + (maxX - minX) * safeOffset, y: minY };
    case 'right':
      return { x: maxX, y: minY + (maxY - minY) * safeOffset };
    case 'bottom':
      return { x: minX + (maxX - minX) * safeOffset, y: maxY };
    case 'left':
    default:
      return { x: minX, y: minY + (maxY - minY) * safeOffset };
  }
};

/**
 * 根据当前位置反推在对应边上的偏移比例。
 */
export const getOffsetFromPosition = (
  edge: Edge,
  nextX: number,
  nextY: number,
  axisLimit: AxisLimit,
) => {
  const { minX, maxX, minY, maxY } = axisLimit;
  const xRange = Math.max(maxX - minX, 1);
  const yRange = Math.max(maxY - minY, 1);

  if (edge === 'top' || edge === 'bottom') {
    return (Math.min(Math.max(nextX, minX), maxX) - minX) / xRange;
  }

  return (Math.min(Math.max(nextY, minY), maxY) - minY) / yRange;
};

/**
 * 找到离当前位置最近的一条边，并计算该边上的偏移比例。
 * 组件拖拽过程中始终贴边移动，因此不会进入容器内部。
 */
export const getNearestEdgePosition = (
  nextX: number,
  nextY: number,
  currentEdge: Edge,
  axisLimit: AxisLimit,
): EdgePosition => {
  const { minX, maxX, minY, maxY } = axisLimit;
  const clampedX = Math.min(Math.max(nextX, minX), maxX);
  const clampedY = Math.min(Math.max(nextY, minY), maxY);

  const distances: Record<Edge, number> = {
    top: Math.abs(clampedY - minY),
    right: Math.abs(clampedX - maxX),
    bottom: Math.abs(clampedY - maxY),
    left: Math.abs(clampedX - minX),
  };

  let edge: Edge = currentEdge;
  let minDistance = distances[edge];

  (Object.keys(distances) as Edge[]).forEach((item) => {
    if (distances[item] < minDistance) {
      minDistance = distances[item];
      edge = item;
    }
  });

  return {
    edge,
    offset: getOffsetFromPosition(edge, clampedX, clampedY, axisLimit),
  };
};

/**
 * 从 localStorage 中读取悬浮组件上次保存的位置。
 */
export const getStoredPosition = (
  storageKey: string,
): DraggableFloatStoredPosition | null => {
  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<DraggableFloatStoredPosition>;
    const isValidEdge = ['top', 'right', 'bottom', 'left'].includes(parsedValue.edge ?? '');
    const isValidOffset = typeof parsedValue.offset === 'number';

    if (!isValidEdge || !isValidOffset) {
      return null;
    }

    const offset = parsedValue.offset as number;

    return {
      edge: parsedValue.edge as Edge,
      offset: Math.min(Math.max(offset, 0), 1),
    };
  } catch {
    return null;
  }
};

/**
 * 将当前吸附位置持久化到 localStorage。
 */
export const setStoredPosition = (
  storageKey: string,
  position: DraggableFloatStoredPosition,
) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(position));
  } catch {
    // 忽略存储异常，避免影响拖拽主流程。
  }
};
