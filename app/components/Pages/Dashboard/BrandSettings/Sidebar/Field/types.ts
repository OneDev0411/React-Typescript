import { SidebarSectionField } from '../../types'

export interface FieldProps<
  T extends Nullable<BrandMarketingPaletteValue> = string
> extends SidebarSectionField {
  value: T
  brandFonts?: string[]
  onChange: (names: BrandMarketingPaletteKey[], value: T) => void
}
