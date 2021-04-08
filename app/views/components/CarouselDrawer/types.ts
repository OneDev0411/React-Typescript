import type { DragObjectWithType } from 'react-dnd'

export interface ImageDragObject extends DragObjectWithType {
  src: string
}

export enum CarouselImageItemEdge {
  BEFORE = 1,
  AFTER
}
