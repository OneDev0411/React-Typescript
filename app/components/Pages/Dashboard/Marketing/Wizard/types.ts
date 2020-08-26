type VariableSection = 'Listing Info' | 'Agent Info' | 'Photos'

export type TemplateVariableType =
  | 'string'
  | 'text'
  | 'number'
  | 'image'
  | 'address'
  | 'sortableImageList'
  | 'sortableImageItem'

export interface SortableImageItemOptions {
  order: number
}

export interface SortableImageListOptions {
  sortableName: string
  images: TemplateVariable<'sortableImageItem'>[]
}

export interface AddressOptions {
  addressName: string
  variableNames: string[]
}

export type TemplateVariable<T extends TemplateVariableType> = {
  section: VariableSection
  name: string
  label: string
  type: T
  value?: string
} & (T extends 'address' ? AddressOptions : {}) &
  (T extends 'sortableImageList' ? SortableImageListOptions : {}) &
  (T extends 'sortableImageItem' ? SortableImageItemOptions : {})
