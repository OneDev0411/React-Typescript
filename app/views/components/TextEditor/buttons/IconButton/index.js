import React from 'react'

import { IconButton } from './styled'

export default function Button(props) {
  const onClick = e =>
    props.isBlockButton ? props.toggleBlockType(e) : props.toggleInlineStyle(e)

  return (
    <IconButton onClick={onClick} isFit {...props}>
      {props.children}
    </IconButton>
  )
}
