import { SidebarSectionField } from '../../types'

export interface FieldProps extends SidebarSectionField {
  value: string
  onChange: (name: BrandSettingsPaletteKey, value: string) => void
}
