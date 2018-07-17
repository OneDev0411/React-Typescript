import React from 'react'

import { Title, Container } from './styled'
import IconButton from '../../Button/IconButton'
import CloseIcon from '../../SvgIcons/Close/CloseIcon'

const Header = ({ title, children, onClose }) => (
  <Container>
    {title && <Title>{title}</Title>}
    {children}
    <IconButton color="#7b91a6" hoverColor="#333" onClick={onClose}>
      <CloseIcon />
    </IconButton>
  </Container>
)

export default Header
