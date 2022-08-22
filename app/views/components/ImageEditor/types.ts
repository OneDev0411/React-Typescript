import { FilterFunctions } from 'pikaso'

export type DRAWING_MODE = 'FREE_DRAWING' | 'LINE_DRAWING'
export type Actions = 'crop' | 'draw' | 'text' | 'filter'

export type FilterType = {
  name: string
  js: Nullable<FilterFunctions>
}

export type ImageFilter = FilterType & {
  dataUrl: string
}

export interface HistoryEvent {
  name: string
  data: {
    canRedo: boolean
    canUndo: boolean
    step: number
    total: number
  }
}
