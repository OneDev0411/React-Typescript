import React, { useCallback, useMemo } from 'react'
import { createStyles, Drawer, makeStyles, Theme } from '@material-ui/core'
import { DrawerProps as OriginalDrawerProps } from '@material-ui/core/Drawer'

import { mergeWith } from 'lodash'

import Body from './Body'
import Header from './Header'
import Footer from './Footer'
import { DrawerContext, useDrawerContext } from './drawer-context'
import { DrawerContextType, DrawerProps, StyleProps } from './types'

export { useDrawerContext } from './drawer-context'
export * from './types'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      // The any type is because of the important word.
      modal: (props: StyleProps): any =>
        props.zIndex
          ? {
              zIndex: `${props.zIndex} !important`
            }
          : {},
      paper: (props: StyleProps) => ({
        width: '100%', // fullwidth on small devices
        '@media (min-width: 48em)': {
          width: props.width
        }
      })
    }),
  { name: 'OverlayDrawer' }
)

export type OverlayDrawerProps = DrawerProps & StyleProps

const OverlayDrawer = ({
  children,
  open = false,
  onClose = () => {},
  closeOnBackdropClick = false,
  // This should be true by default, but it's temporarily disabled until
  // modals are also migrated to MUI modals to prevent weird issues of
  // drawer being closed by escape while the modal on top is kept open
  closeOnEscape = false,
  anchor = 'right',
  width = '38rem',
  zIndex,
  ...rest
}: OverlayDrawerProps) => {
  const classes = useStyles({ width, zIndex })
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

  const mergedClasses = mergeWith<
    DrawerProps['classes'],
    DrawerProps['classes']
  >(
    { modal: classes.modal, paper: classes.paper },
    rest.classes,
    (value1, value2) => `${value1 || ''} ${value2 || ''}`
  )

  return (
    <Drawer
      /* It causes problems in focusing poppers (and possibly other kind of modals). We can check this after fully migrating to MUI  */
      disableEnforceFocus
      {...rest}
      open={open}
      onClose={handleOnClose}
      anchor={anchor}
      classes={mergedClasses}
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
