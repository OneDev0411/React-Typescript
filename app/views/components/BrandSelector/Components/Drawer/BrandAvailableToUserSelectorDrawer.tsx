import { BaseBrandAvailableToUserSelector } from '../Base'

import { BaseSingleSelectDrawer } from './components/BaseSingleSelectDrawer'
import { BaseSingleSelectDrawer as BaseSingleSelectDrawerProps } from './type'

export function BrandAvailableToUserSelectorDrawer({
  brandSelectorProps = {},
  ...props
}: BaseSingleSelectDrawerProps) {
  return (
    <BaseSingleSelectDrawer {...props}>
      <BaseBrandAvailableToUserSelector {...brandSelectorProps} />
    </BaseSingleSelectDrawer>
  )
}
