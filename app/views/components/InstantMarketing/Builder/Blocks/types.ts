export interface BlockOptions {
  label: string
  icon?: string
  category: string
  blockName: string
  template: string
  adaptive?: boolean
}

export interface TemplateBlockContent {
  name: string
  icon: string
  category: string
  label: string
  adaptive?: boolean
  type: string
}

export interface TemplateBlock extends TemplateBlockContent {
  template: string
}

export type TemplateBlocks = Record<string, TemplateBlock>
