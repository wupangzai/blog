export type Edge = 'top' | 'right' | 'bottom' | 'left';

export interface Rect {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

export interface Size {
  width: number
  height: number
}

export interface AxisLimit {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export interface EdgePosition {
  edge: Edge
  offset: number
}

export interface DraggableFloatStoredPosition {
  edge: Edge
  offset: number
}
