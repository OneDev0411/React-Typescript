import { SidebarSectionField } from '../../types'

export type AddressFieldValue = Partial<IStdAddr>
export type FieldValue = string | AddressFieldValue
export interface FieldProps<T extends FieldValue = string>
  extends SidebarSectionField {
  value: T
  brandFonts?: string[]
  onChange: (names: BrandMarketingPaletteKey[], value: T) => void
}
