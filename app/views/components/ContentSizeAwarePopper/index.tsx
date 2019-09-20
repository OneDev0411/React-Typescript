import { PopperProps } from '@material-ui/core/Popper'
import { useCallback, useRef } from 'react'
import PopperJs from 'popper.js'

import { Popper } from '@material-ui/core'

import * as React from 'react'

import { usePopoverResize } from 'hooks/use-popover-resize'

/**
 * We use an extra wrapper to track the size of the popover content and call
 * update when it's changed. When
 * [Fragment refs RFC](https://github.com/reactjs/rfcs/pull/97) is available,
 * we can upgrade this to that. Or maybe even MUI Popover and Popper use it
 * internally and we can remove this wrapping layer.
 */
function ContentSizeAwarePopper({
  children,
  open,
  popperRef: externalPopperRef,
  ...props
}: PopperProps) {
  const contentElRef = useRef<HTMLElement>(null)
  const popperRef = useRef<PopperJs | null>(null)

  if (externalPopperRef) {
    if (typeof externalPopperRef === 'function') {
      externalPopperRef(popperRef.current)
    } else {
      // @ts-ignore
      externalPopperRef.current = popperRef
    }
  }

  const updatePosition = useCallback(() => {
    if (popperRef.current) {
      popperRef.current.update()
    }
  }, [])

  usePopoverResize(open, contentElRef, updatePosition)

  return (
    <Popper open={open} popperRef={popperRef} {...props}>
      {/*
      //@ts-ignore */}
      <x-fragment ref={contentElRef}>{children}</x-fragment>
    </Popper>
  )
}

export default ContentSizeAwarePopper
