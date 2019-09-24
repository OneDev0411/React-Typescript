import { useCallback, useRef, useState } from 'react'

import cuid from 'cuid'

/**
 * Maintains state for popovers and menus and provides required utilities
 * for opening and closing menu. Also provides these utilities as props
 * for MUI components
 */

export function useMenu(id: string = cuid()) {
  const triggerRef = useRef<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen(open => !open), [])

  return {
    triggerRef,
    triggerProps: {
      buttonRef: triggerRef,
      onClick: toggle,
      'aria-controls': id,
      'aria-haspopup': true
    },
    menuProps: { id, open, onClose, anchorEl: triggerRef.current },
    open,
    onClose,
    toggle
  }
}
