import React, { HTMLProps, ReactNode } from 'react'

import { IconButton } from './styled'

interface Props extends HTMLProps<'button'> {
  isBlockButton?: boolean
  toggleBlockType?: (event: React.MouseEvent) => void
  toggleInlineStyle?: (event: React.MouseEvent) => void
  children: ReactNode
}

export default function Button({
  toggleBlockType = () => {},
  toggleInlineStyle = () => {},
  ...props
}: Props) {
  const onClick = e =>
    props.isBlockButton ? toggleBlockType(e) : toggleInlineStyle(e)

  // NOTE: type="button" is required because default type is "submit"
  // and this causes unwanted form submission if the text editor component
  // is used inside a form
  return (
    <IconButton type="button" onClick={onClick} isFit {...props}>
      {props.children}
    </IconButton>
  )
}
