import Drawer from '@app/views/components/OverlayDrawer'

import {
  BaseUserRootBrandSelector,
  BaseBrandAvailableToUserSelector
} from '../Base'

import { useStyles } from './styles'
import { BaseSelectorDrawer as Props } from './type'

export function BrandSelectorDrawer({
  drawerTitle = 'Select Agents',
  brandSelectorProps = {},
  ...props
}: Props) {
  const classes = useStyles()

  return (
    <>
      <Drawer {...props}>
        <Drawer.Header title={drawerTitle} />
        <Drawer.Body>
          <div className={classes.container}>
            <BaseBrandAvailableToUserSelector {...brandSelectorProps} />
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
