export interface TemplateVariable {
  name: string
  label: string
  type: 'string' | 'address' | 'number' | 'image'
  value?: string
}

export interface TemplateVariableSectionWithItems {
  label: string
  items: TemplateVariable[]
}
