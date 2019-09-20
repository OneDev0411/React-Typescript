import { PopoverActions, PopoverProps } from '@material-ui/core/Popover'
import { Popover } from '@material-ui/core'
import * as React from 'react'
import { useCallback, useRef } from 'react'

import { usePopoverResize } from 'hooks/use-popover-resize'

/**
 * We use an extra wrapper to track the size of the popover content and call
 * update when it's changed. When
 * [Fragment refs RFC](https://github.com/reactjs/rfcs/pull/97) is available,
 * we can upgrade this to that. Or maybe even MUI Popover and Popper use it
 * internally and we can remove this wrapping layer.
 *
 * IMPORTANT: this doesn't work because calling latest updatePosition
 * function which is passed to `action` prop doesn't work for some reason
 */
function ContentSizeAwarePopover({
  children,
  open,
  action,
  ...props
}: PopoverProps) {
  const contentElRef = useRef<HTMLElement>(null)
  const actionsRef = useRef<PopoverActions | null>(null)

  const updatePosition = useCallback(() => {
    if (actionsRef.current) {
      // Calling updatePosition doesn't work for some reason.
      // it seems it's an outdated function which has no effect on the latest
      // rendered content
      actionsRef.current.updatePosition()
    }
  }, [])

  usePopoverResize(open, contentElRef, updatePosition)

  return (
    <Popover
      open={open}
      action={actions => {
        actionsRef.current = actions
        action && action(actions)
      }}
      {...props}
    >
      {/*
      //@ts-ignore */}
      <x-fragment ref={contentElRef}>{children}</x-fragment>
    </Popover>
  )
}

export default ContentSizeAwarePopover
