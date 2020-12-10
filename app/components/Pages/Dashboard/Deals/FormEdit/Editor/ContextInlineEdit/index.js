import React from 'react'
import ClickOutside from 'react-click-outside'

import { Container } from './styled'

function getPosition(bounds, width = 400) {
  if (!window) {
    return {}
  }

  const ww = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )

  const left =
    bounds.left + window.scrollX + width < ww
      ? bounds.left + window.scrollX
      : bounds.right - width

  const position = {
    left,
    top: bounds.top,
    width
  }

  return position
}

export function ContextInlineEdit(props) {
  if (!props.isOpen) {
    return null
  }

  return (
    <ClickOutside onClickOutside={props.onDismiss}>
      <Container position={getPosition(props.bounds, props.width)}>
        {props.children}
      </Container>
    </ClickOutside>
  )
}
