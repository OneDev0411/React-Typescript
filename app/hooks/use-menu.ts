import { useCallback, useRef, useState } from 'react'

import cuid from 'cuid'
import { useTheme } from '@material-ui/core'
import { ClickAwayListenerProps } from '@material-ui/core/ClickAwayListener'

/**
 * Maintains state for popovers and menus and provides required utilities
 * for opening and closing menu. Also provides these utilities as props
 * for MUI components
 */

export function useMenu({ id = cuid(), defaultIsOpen = false } = {}) {
  const triggerRef = useRef<HTMLElement | null>(null)
  const [open, setOpen] = useState(defaultIsOpen)
  const onClose = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen(open => !open), [])
  const {
    zIndex: { modal: zIndex }
  } = useTheme()

  const sharedTriggerProps = {
    onClick: toggle,
    'aria-controls': id,
    'aria-haspopup': true
  }

  const clickAwayListenerProps: Pick<ClickAwayListenerProps, 'onClickAway'> = {
    onClickAway: event => {
      if (
        !(
          triggerRef.current &&
          event.target instanceof HTMLElement &&
          triggerRef.current.contains(event.target)
        )
      ) {
        setOpen(false)
      }
    }
  }
  const iconButtonTriggerProps = {
    ...sharedTriggerProps,
    buttonRef: triggerRef
  }

  return {
    triggerRef,
    clickAwayListenerProps,
    elementTriggerProps: { ...sharedTriggerProps, ref: triggerRef },
    buttonTriggerProps: iconButtonTriggerProps,
    menuProps: { id, open, onClose, anchorEl: triggerRef.current },
    open,
    zIndex,
    onClose,
    toggle
  }
}
