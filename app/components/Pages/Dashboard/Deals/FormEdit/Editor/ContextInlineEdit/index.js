import React from 'react'
import ClickOutside from 'react-click-outside'

import { Container } from './styled'

function getPosition(bounds) {
  if (!window) {
    return {}
  }

  const ww = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )

  const width = 500

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
  return (
    <ClickOutside onClickOutside={props.onDismiss}>
      <Container position={getPosition(props.bounds)}>
        {props.children}
      </Container>
    </ClickOutside>
  )
}
