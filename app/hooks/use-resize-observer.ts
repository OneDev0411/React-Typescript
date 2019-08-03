import { useMemo } from 'react'

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
  const observer = useMemo(() => {
    if (MutationObserver) {
      return new MutationObserver(callback)
    }

    return { observe() {}, disconnect() {} }
  }, [callback])

  return useMemo(
    () => ({
      observe: (target: Node) => {
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
