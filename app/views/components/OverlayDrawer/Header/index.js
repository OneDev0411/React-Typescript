import React from 'react'

import { Title, Container } from './styled'
import IconButton from '../../Button/IconButton'
import CloseIcon from '../../SvgIcons/Close/CloseIcon'

const Header = ({ title, children, onClose, style, render }) => {
  if (render && typeof render === 'function') {
    return <Container style={style}>{render()}</Container>
  }

  return (
    <Container style={style}>
      {title && <Title>{title}</Title>}
      {children}
      <IconButton
        type="button"
        isFit
        iconSize="large"
        inverse
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </Container>
  )
}

export default Header
