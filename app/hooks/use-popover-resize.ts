import { RefObject, useEffect } from 'react'

import { useResizeObserver } from './use-resize-observer'

export function usePopoverResize(
  open: boolean,
  contentElRef: RefObject<HTMLElement>,
  updatePosition: () => void
) {
  const { disconnect, observe } = useResizeObserver(updatePosition)

  useEffect(() => {
    if (open) {
      // setTimeout is used because the ref.current is null at this moment
      setTimeout(() => {
        updatePosition()

        if (contentElRef.current) {
          observe(contentElRef.current)

          return disconnect
        }
      })
    }
  }, [contentElRef, disconnect, observe, open, updatePosition])
}
