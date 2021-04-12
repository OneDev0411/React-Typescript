import type { Model } from 'backbone'

import type { TemplateRenderData } from '../utils/get-template-render-data'

export interface BlockOptions {
  label: string
  icon?: string
  category: string
  blockName: string
  template: string
  adaptive?: boolean
}

export interface TemplateBlockBase {
  name: string
  icon: string
  category: string
  label: string
  adaptive?: boolean
  type: string
}

export interface TemplateBlockBaseOptions {
  blocks: TemplateBlockBase[]
  disableDefault?: string[] | true
}

export interface TemplateBlock extends TemplateBlockBase {
  template: string
}

export type TemplateBlocks = Record<string, TemplateBlock>

export interface TemplateBlockOptions {
  blocks: TemplateBlocks
  disableDefault?: string[] | true
}

export type BlockTemplates = Record<string, string>

export type GetBlockTemplateFunc = (
  parent: HTMLElement | null,
  blockId: string
) => string

export type TemplateRenderDataFunc<T> = (
  selectedItem: T,
  blockId: string
) => TemplateRenderData

export type BlockOnDropFunc = (model: Model, blockId: string) => void

export interface BlockDragStopEventReturn<T> {
  selectHandler: (selectedItem?: T) => void
}
