import React from 'react'

import { IconButton } from './styled'

export default function Button(props) {
  const onClick = () =>
    props.isBlockButton ? props.toggleBlockType() : props.toggleInlineStyle()

  return (
    <IconButton onClick={onClick} isFit {...props}>
      {props.children}
    </IconButton>
  )
}
