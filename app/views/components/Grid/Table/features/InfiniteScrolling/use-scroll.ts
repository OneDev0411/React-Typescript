import { useState } from 'react'
import debounce from 'lodash/debounce'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { GridInfiniteScrolling } from '../../types'

export function useInfiniteScroll(options: GridInfiniteScrolling | null) {
  const [lastScrollTop, setLastScrollTop] = useState(0)

  useEffectOnce(() => {
    if (!options) {
      return
    }

    const getElement = (
      container: React.RefObject<HTMLElement> | string | undefined
    ) => {
      if (!container) {
        return window
      }

      if (typeof container === 'string') {
        return document.getElementById(container)
      }

      return container.current
    }

    const element = getElement(options.container)

    const update = (el: Event): void => {
      if (!options) {
        return
      }

      const { onScrollBottom, onScrollTop } = options
      const accuracy = options.accuracy || 90

      const target = (el.target as any).scrollingElement || el.target

      const top = target.scrollTop - target.clientTop
      const end = target.scrollHeight - target.offsetHeight

      if (onScrollBottom && top >= end - accuracy) {
        setLastScrollTop(top)
        onScrollBottom()

        return
      }

      const isScrolledToTop = top <= lastScrollTop

      setLastScrollTop(top)

      if (onScrollTop && isScrolledToTop && top <= accuracy) {
        onScrollTop()
      }
    }

    const listener = options.debounceTime
      ? debounce(update, options.debounceTime)
      : update

    element && element.addEventListener('scroll', listener, { passive: true })
    window.addEventListener('resize', listener, { passive: true })

    return () => {
      element && element.removeEventListener('scroll', listener)
      window.removeEventListener('resize', listener)
    }
  })
}
