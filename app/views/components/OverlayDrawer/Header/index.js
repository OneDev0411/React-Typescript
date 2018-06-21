import React from 'react'
import { Container, Title, IconContainer } from './styled'

import CloseIcon from '../../SvgIcons/Close/CloseIcon'

const Header = ({ title, onClose }) => (
  <Container>
    <Title>{title}</Title>

    <IconContainer onClick={onClose}>
      <CloseIcon color="#7b91a6" />
    </IconContainer>
  </Container>
)

export default Header
