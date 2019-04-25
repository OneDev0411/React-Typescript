import React from 'react'

import { IconButton } from './styled'

export default function Button(props) {
  const onClick = e =>
    props.isBlockButton ? props.toggleBlockType(e) : props.toggleInlineStyle(e)

  // NOTE: type="button" is required because default type is "submit"
  // and this causes unwanted form submission if the text editor component
  // is used inside a form
  return (
    <IconButton type="button" onClick={onClick} isFit {...props}>
      {props.children}
    </IconButton>
  )
}
