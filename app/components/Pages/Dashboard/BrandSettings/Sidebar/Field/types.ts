import { SidebarSectionField } from '../../types'

export interface FieldProps extends SidebarSectionField {
  value: string
  onChange: (names: BrandSettingsPaletteKey[], value: string) => void
}
