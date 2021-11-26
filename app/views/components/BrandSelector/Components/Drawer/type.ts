import { OverlayDrawerProps } from '@app/views/components/OverlayDrawer'

import { BaseBrandSelectorProps } from '../Base'

interface BaseDrawerProps extends OverlayDrawerProps {
  drawerTitle?: string
}

export interface BaseSelectorDrawer extends BaseDrawerProps {
  brandSelectorProps?: BaseBrandSelectorProps
}
export interface MultiSelectionBrandSelectoeDrawer extends BaseDrawerProps {
  brandSelectorProps?: Omit<BaseBrandSelectorProps, 'nodeRenderer'>
  selectedBrands?: UUID[]
  onSave: (brands: UUID[]) => Promise<void>
}
