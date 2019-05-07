import React from 'react'
import ClickOutside from 'react-click-outside'

import RolesEdit from './Role'

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
  const top = bounds.top + window.scrollY

  const position = {
    left,
    top,
    width
  }

  return position
}

export function ContextInlineEdit(props) {
  const { type } = props.item
  const { bounds } = props.item.data

  const sharedProps = {
    ...props.item.data,
    deal: props.deal
  }

  return (
    <ClickOutside onClickOutside={props.onDismiss}>
      <Container position={getPosition(bounds)}>
        {type === 'Role' && <RolesEdit {...sharedProps} />}
      </Container>
    </ClickOutside>
  )
}
