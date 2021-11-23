import { OverlayDrawerProps } from '@app/views/components/OverlayDrawer'

import { BaseUserRootBrandSelectorProps } from '../Base/BaseUserRootBrandSelector'

interface BaseDrawerProps extends OverlayDrawerProps {
  drawerTitle?: string
}

export interface BaseSelectorDrawer extends BaseDrawerProps {
  brandSelectorProps?: BaseUserRootBrandSelectorProps
}
export interface MultiSelectionBrandSelectoeDrawer extends BaseDrawerProps {
  brandSelectorProps?: Omit<BaseUserRootBrandSelectorProps, 'nodeRenderer'>
  selectedBrands?: UUID[]
  onSave: (brands: UUID[]) => Promise<void>
}
