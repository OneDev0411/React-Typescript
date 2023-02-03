import { createContext } from 'react'

import Pikaso, { LabelModel } from 'pikaso'

import type { TemplateOptions } from '../../../../types'

export interface CanvasTextContext {
  editor: Nullable<Pikaso>
  textPreviewLabel: Nullable<LabelModel>
  templateOptions: Nullable<TemplateOptions>
  setTextProperty: (property: string, value: unknown) => void
  setTagProperty: (property: string, value: unknown) => void
  getTextProperty<T>(property: string): T | undefined
  getTagProperty<T>(property: string): T | undefined
  preview: () => void
}

export const Context = createContext<CanvasTextContext | undefined>(undefined)
