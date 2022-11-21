import { SidebarSectionField } from '../../types'

export interface FieldProps<
  T extends BrandMarketingPaletteValue = string | null
> extends SidebarSectionField {
  value: T
  brandFonts?: string[]
  onChange: (names: BrandMarketingPaletteKey[], value: T) => void
}
