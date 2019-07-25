import { RefObject, useEffect } from 'react'

/**
 * Autofocues the input only when it's in the viewport.
 * See this for a use case: https://github.com/mui-org/material-ui/issues/16740
 */
export function useInViewportAutofocus(
  ref: RefObject<HTMLElement>,
  initialTimeout = 0
) {
  useEffect(() => {
    let i = 0
    let timeout
    const check = () => {
      const inViewPort = ref.current && !isElementOutViewport(ref.current)

      if (inViewPort) {
        ref.current!.focus()
      } else {
        timeout = setTimeout(check, 1.1 ** i * 100)
        i++
      }
    }

    timeout = setTimeout(check, initialTimeout)

    return () => {
      clearTimeout(timeout)
    }
  }, [initialTimeout, ref])
}

function isElementOutViewport(el: Element) {
  const rect = el.getBoundingClientRect()

  return (
    rect.bottom < 0 ||
    rect.right < 0 ||
    rect.left > window.innerWidth ||
    rect.top > window.innerHeight
  )
}
