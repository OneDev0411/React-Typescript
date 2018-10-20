import React from 'react'

import { Title, Container } from './styled'
import IconButton from '../../Button/IconButton'
import CloseIcon from '../../SvgIcons/Close/CloseIcon'

const Header = ({ title, children, onClose }) => (
  <Container>
    {title && <Title>{title}</Title>}
    {children}
    <IconButton type="button" isFit iconSize="large" inverse onClick={onClose}>
      <CloseIcon />
    </IconButton>
  </Container>
)

export default Header
