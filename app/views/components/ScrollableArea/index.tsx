import React, { CSSProperties, ReactNode, useRef } from 'react'
import cn from 'classnames'

import { useScrollDetector } from '../../../hooks/use-scroll-detector'

import { Content, ScrollableWrapperProps, Wrapper } from './styled'

/**
 * An scrollable area with optional shadows at each end when it's possible
 * to scroll at that end
 * When user can scroll in one direction, they will see a shadow in that end
 * which indicates there are more content left in that direction.
 * It's most useful in touch devices where scrollbar is not visible but
 * it can improve UX in non-touch devices too.
 */

interface Props extends ScrollableWrapperProps {
  hasScrollIndicatorShadows?: boolean
  style?: CSSProperties
  /**
   * offset in pixel to remove shadows
   */
  offset?: number
  debounce?: number
  children: ReactNode
  hasThinnerScrollbar?: boolean
}

export function ScrollableArea({
  hasScrollIndicatorShadows = true,
  style = {},
  offset = 0,
  shadowHeight = 5,
  shadowColor = 'grey',
  debounce = 0,
  children,
  hasThinnerScrollbar = false
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null)

  const { reachedEnd, reachedStart } = useScrollDetector(contentRef, {
    enabled: hasScrollIndicatorShadows,
    offset,
    debounceWait: debounce
  })

  const classes = cn({
    'u-scrollbar--thinner': hasThinnerScrollbar,
    'has-bottom-shadow': !reachedEnd,
    'has-top-shadow': !reachedStart
  })

  return (
    <Wrapper
      style={style}
      className={classes}
      shadowHeight={shadowHeight}
      shadowColor={shadowColor}
    >
      <Content ref={contentRef}>{children}</Content>
    </Wrapper>
  )
}
