import { ReactNode } from 'react'

import { OverlayDrawerProps } from '@app/views/components/OverlayDrawer'

import { BaseBrandSelectorProps } from '../Base'

interface BaseDrawerProps extends OverlayDrawerProps {
  drawerTitle?: string
  children?: ReactNode
}

export interface BaseSingleSelectDrawer extends BaseDrawerProps {
  brandSelectorProps?: BaseBrandSelectorProps
}
export interface BaseMultiSelectDrawer extends BaseDrawerProps {
  brandSelectorProps?: Omit<BaseBrandSelectorProps, 'nodeRenderer'>
  selectedBrands?: UUID[]
  onSave: (brands: UUID[]) => Promise<void>
}
