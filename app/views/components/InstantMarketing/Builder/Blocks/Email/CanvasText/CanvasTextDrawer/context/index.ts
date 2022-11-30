import { createContext } from 'react'

import Pikaso, { LabelModel } from 'pikaso'

export interface CanvasTextContext {
  editor: Nullable<Pikaso>
  label: Nullable<LabelModel>
  setTextProperty: (property: string, value: unknown) => void
  setTagProperty: (property: string, value: unknown) => void
  getTextProperty<T>(property: string): T | undefined
  getTagProperty<T>(property: string): T | undefined
  preview: () => void
}

export const Context = createContext<CanvasTextContext | undefined>(undefined)
