import { OverlayDrawerProps } from '@app/views/components/OverlayDrawer'

import { BaseBrandSelectorProps } from '../Base'

interface BaseDrawerProps extends OverlayDrawerProps {
  drawerTitle?: string
}

export interface BaseSelectorDrawer extends BaseDrawerProps {
  brandSelectorProps?: BaseBrandSelectorProps
}
export interface MultiSelectionBrandSelectorDrawer extends BaseDrawerProps {
  brandSelectorProps?: Omit<BaseBrandSelectorProps, 'nodeRenderer'>
  selectedBrands?: UUID[]
  saveButtonText?: string
  disabled?: boolean
  onSave: (brands: UUID[]) => Promise<void>
}
