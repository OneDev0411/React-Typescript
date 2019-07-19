import { RefObject, useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { Cancelable } from 'underscore'

interface UseScrollDetectorOptions {
  offset?: number
  enabled?: boolean
  debounceWait?: number
}

/**
 * Given an element (normally from a ref), it returns an object in the form of
 * {reachedEnd: boolean, reachedStart: boolean} which indicates scroll bars
 * for that element are reached to end or not.
 * Some use cases:
 * - Showing a shadow at the ends of an scrollable area if they haven't reached
 *   to the end on each side.
 * - Creating useInfiniteScroll on top of it
 */
export function useScrollDetector(
  ref: RefObject<HTMLElement>,
  { offset = 0, enabled = true, debounceWait = 0 }: UseScrollDetectorOptions
) {
  const [reachedStart, setReachedStart] = useState(false)
  const [reachedEnd, setReachedEnd] = useState(false)

  const update = useCallback(() => {
    const element = ref.current

    if (element && enabled) {
      const maxScrollTop = element.scrollHeight - element.offsetHeight

      setReachedEnd(maxScrollTop - element.scrollTop <= offset)
      setReachedStart(element.scrollTop <= offset)
    }
  }, [enabled, offset, ref])

  useEffect(() => {
    update()

    const listener = debounceWait > 0 ? debounce(update, debounceWait) : update

    const element = ref.current

    if (enabled && element && typeof window !== 'undefined') {
      // this scroll handling could be written more declarative with
      // onScroll prop if react had support for {passive: true} in
      // event handlers
      element.addEventListener('scroll', listener, { passive: true })
      window.addEventListener('resize', listener, { passive: true })

      return () => {
        if (isCancelable(listener)) {
          listener.cancel()
        }

        window.removeEventListener('resize', listener)
        element.removeEventListener('scroll', listener)
      }
    }
  }, [debounceWait, enabled, update, ref])

  return {
    reachedStart,
    reachedEnd
  }
}

function isCancelable(fn: any | Cancelable): fn is Cancelable {
  return fn && typeof fn.cancel === 'function'
}
