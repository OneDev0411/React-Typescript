import { ReactNode } from 'react'

import { OverlayDrawerProps } from '@app/views/components/OverlayDrawer'

import { BaseBrandSelectorProps } from '../Base'
import { BaseUserRootBrandSelectorProps } from '../Base/BaseUserRootBrandSelector'

interface BaseDrawerProps extends OverlayDrawerProps {
  drawerTitle?: string
  children?: ReactNode
}

export interface BaseSingleSelectDrawer extends BaseDrawerProps {
  brandSelectorProps?: BaseBrandSelectorProps
}
export interface BaseMultiSelectDrawer extends BaseDrawerProps {
  brandSelectorProps?: Omit<BaseUserRootBrandSelectorProps, 'nodeRenderer'>
  selectedBrands?: UUID[]
  saveButtonText?: string
  disabled?: boolean
  onSave: (brands: UUID[]) => Promise<void>
}
