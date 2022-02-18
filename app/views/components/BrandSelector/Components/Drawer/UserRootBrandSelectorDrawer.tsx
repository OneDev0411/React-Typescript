import { BaseUserRootBrandSelector } from '../Base'

import { BaseSingleSelectDrawer } from './components/BaseSingleSelectDrawer'
import { BaseSingleSelectDrawer as BaseSingleSelectDrawerProps } from './type'

export function UserRootBrandSelectorDrawer({
  brandSelectorProps = {},
  ...props
}: BaseSingleSelectDrawerProps) {
  return (
    <BaseSingleSelectDrawer {...props}>
      <BaseUserRootBrandSelector {...brandSelectorProps} />
    </BaseSingleSelectDrawer>
  )
}
