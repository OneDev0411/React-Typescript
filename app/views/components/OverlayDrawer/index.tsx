import React, { useCallback, useMemo } from 'react'
import { Drawer, makeStyles } from '@material-ui/core'
import { DrawerProps as OriginalDrawerProps } from '@material-ui/core/Drawer'

import Body from './Body'
import Header from './Header'
import Footer from './Footer'
import { DrawerContext, useDrawerContext } from './drawer-context'
import { DrawerContextType, DrawerProps } from './types'

export { useDrawerContext } from './drawer-context'

const useStyles = makeStyles({
  root: {
    '@media (min-width: 48em)': {
      width: '37rem'
    }
  }
})

const OverlayDrawer = ({
  children,
  showBackdrop = true,
  open = false,
  onClose = () => {},
  closeOnBackdropClick = false,
  // This should be true by default, but it's temporarily disabled until
  // modals are also migrated to MUI modals to prevent weird issues of
  // drawer being closed by escape while the modal on top is kept open
  closeOnEscape = false,
  anchor = 'right',
  ModalProps = {},
  ...rest
}: DrawerProps) => {
  const classes = useStyles()
  const parentDrawerContext = useDrawerContext()

  const handleOnClose: OriginalDrawerProps['onClose'] = useCallback(
    (event, reason) => {
      if (reason === 'backdropClick' && closeOnBackdropClick) {
        onClose(event, reason)
      }

      if (reason === 'escapeKeyDown' && closeOnEscape) {
        onClose(event, reason)
      }
    },
    [closeOnBackdropClick, closeOnEscape, onClose]
  )

  const level = parentDrawerContext ? parentDrawerContext.level + 1 : 1

  const context: DrawerContextType = useMemo(
    () => ({
      onClose,
      level
    }),
    [level, onClose]
  )

  return (
    <Drawer
      /* It causes problems in focusing poppers (and possibly other kind of modals). We can check this after fully migrating to MUI  */
      disableEnforceFocus
      {...rest}
      open={open}
      onClose={handleOnClose}
      anchor={anchor}
      classes={{ paper: classes.root }}
      ModalProps={{ hideBackdrop: !showBackdrop, ...ModalProps }}
      data-test={`drawer-${level}`}
    >
      <DrawerContext.Provider value={context}>
        {children}
      </DrawerContext.Provider>
    </Drawer>
  )
}

OverlayDrawer.Body = Body
OverlayDrawer.Header = Header
OverlayDrawer.Footer = Footer

export default OverlayDrawer
