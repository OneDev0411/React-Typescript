export interface ImageEditor extends tuiImageEditor.ImageEditor {
  off?: (eventName: string) => void
}

export interface ObjectActivatedData {
  id: number
  type: 'cropzone'
  width: number
  height: number
}

export type DRAWING_MODE = 'FREE_DRAWING' | 'LINE_DRAWING'

export type Actions =
  | 'crop'
  | 'flip'
  | 'rotate'
  | 'mask'
  | 'draw'
  | 'text'
  | 'shape'
  | 'icon'
  | 'filter'
