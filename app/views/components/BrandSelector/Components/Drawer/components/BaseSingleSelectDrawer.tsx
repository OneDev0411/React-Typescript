import Drawer from '@app/views/components/OverlayDrawer'

import { useStyles } from '../styles'
import { BaseSingleSelectDrawer as BaseSingleSelectDrawerProps } from '../type'

export function BaseSingleSelectDrawer({
  drawerTitle = 'Select Agents',
  children,
  ...props
}: BaseSingleSelectDrawerProps) {
  const classes = useStyles()

  return (
    <>
      <Drawer {...props}>
        <Drawer.Header title={drawerTitle} />
        <Drawer.Body>
          <div className={classes.container}>{children}</div>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
