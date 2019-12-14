import React from 'react'

import { useNonBlockingDrawerStyles } from 'utils/../styles/use-non-blocking-drawer-styles'
import OverlayDrawer, { DrawerProps } from 'components/OverlayDrawer'

/**
 * A drawer for showing emails of an email thread.
 * You either pass {@link Props#thread} or {@link Props#threadKey}.
 * If `threadKey` is passed, it will be used to fetch the thread and show it,
 * if `thread` object is passed directly it uses that.
 * `thread` has higher priority if both are passed.
 */
export function Drawer(props: DrawerProps) {
  const classes = useNonBlockingDrawerStyles()

  return (
    <OverlayDrawer
      classes={classes}
      hideBackdrop
      PaperProps={{ style: { width: '50vw', minWidth: '45rem' } }}
      {...props}
    />
  )
}
