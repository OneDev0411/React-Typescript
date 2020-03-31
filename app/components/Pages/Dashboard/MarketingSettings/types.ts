export type FieldType =
  | 'image'
  | 'color'
  | 'pixel'
  | 'font-family'
  | 'font-weight'

export interface SidebarSectionField {
  name: BrandSettingsPaletteKey
  type: FieldType
  label: string
}

export interface SidebarSection {
  name: string
  fields: SidebarSectionField[]
}
