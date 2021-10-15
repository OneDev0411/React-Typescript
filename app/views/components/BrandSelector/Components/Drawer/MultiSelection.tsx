import Drawer from '@app/views/components/OverlayDrawer'

import { BaseBrandSelector } from '../Base'

import { useStyles } from './styles'
import { BaseSelectoeDrawer as Props } from './type'

export function MultiSelectionBrandSelectorDrawer({
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
            <BaseBrandSelector />
          </div>
        </Drawer.Body>
        <Drawer.Footer>xxx</Drawer.Footer>
      </Drawer>
    </>
  )
}
