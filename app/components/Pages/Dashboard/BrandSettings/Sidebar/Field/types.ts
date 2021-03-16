import { SidebarSectionField } from '../../types'

export interface FieldProps extends SidebarSectionField {
  value: string
  brandFonts?: string[]
  onChange: (names: BrandMarketingPalette[], value: string) => void
}
