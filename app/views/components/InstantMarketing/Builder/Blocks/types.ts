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
  icon?: string
  category?: string
  label?: string
  adaptive?: boolean
  type?: string
}

export interface TemplateOptions {
  blocks: TemplateBlockBase[]
  disableDefault?: string[] | true
  textEditor?: {
    extraFonts?: TemplateFont[]
    extraColors?: string[]
  }
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

export type TemplateRenderDataFunc<TSelectedItem, TCustomRenderData> = (
  selectedItem: TSelectedItem,
  blockId: string
) => TemplateRenderData<TCustomRenderData>

export type BlockOnDropFunc = (model: Model, blockId: string | number) => void

export interface RegisterBlockSelectHandler<TSelectedItem> {
  selectHandler: (selectedItem?: TSelectedItem) => void
}

export interface TemplateFontVariant {
  files: Record<string, string>
  local?: string
  'font-weight': string
  'font-style': string
}

export interface TemplateLocalFont {
  source: 'local'
  name: string
}

export interface TemplateCssFont {
  source: 'css'
  name: string
  variants: string[]
  url: string
}

export interface TemplateFileFont {
  source: 'file'
  name: string
  variants: TemplateFontVariant[]
}

export type TemplateFont = TemplateFileFont | TemplateCssFont
