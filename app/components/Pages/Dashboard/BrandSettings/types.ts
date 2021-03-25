export type FieldType =
  | 'image'
  | 'color'
  | 'pixel'
  | 'font-family'
  | 'font-weight'
  | 'text'
  | 'border'

export interface SidebarSectionField {
  names: BrandMarketingPaletteKey[]
  type: FieldType
  label: string
}

export interface SidebarSection {
  name: string
  fields: (SidebarSectionField | 'divider')[]
}

export type ImageUploadHandler = (image: File) => Promise<IFile>
