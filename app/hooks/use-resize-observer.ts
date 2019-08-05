import { useMemo, useRef } from 'react'

/**
 * ResizeObserver is not used because of two reasons:
 * - If the element has inline display (which is the case for x-fragment,
 *   it doesn't work as the element is not resized.
 * - It's not well supported accross browsers. Firefox for example doesn't
 *   support it
 */

export function useResizeObserver(
  callback
): {
  observe: (target: Node) => void
  disconnect: () => void
} {
  const targetRef = useRef<Node | undefined>(undefined)
  const targetSizeRef = useRef<{ width: number; height: number } | undefined>(
    undefined
  )
  const observer = useMemo(() => {
    if (MutationObserver) {
      return new MutationObserver(() => {
        if (targetRef.current instanceof HTMLElement) {
          const boundingRect = targetRef.current.getBoundingClientRect()
          const targetSize = targetSizeRef.current

          if (
            !targetSize ||
            targetSize.width !== boundingRect.width ||
            targetSize.height !== boundingRect.height
          ) {
            targetSizeRef.current = {
              width: boundingRect.width,
              height: boundingRect.height
            }
            callback()
          }
        } else {
          callback()
        }
      })
    }

    return { observe() {}, disconnect() {} }
  }, [callback])

  return useMemo(
    () => ({
      observe: (target: Node) => {
        observer.disconnect()
        targetRef.current = target

        observer.observe(target, {
          subtree: true,
          childList: true
        })
      },
      disconnect: () => {
        observer.disconnect()
      }
    }),
    [observer]
  )
}
