import React from 'react'

import { Title, Container } from './styled'
import IconButton from '../../Button/IconButton'
import CloseIcon from '../../SvgIcons/Close/CloseIcon'

const Header = ({ title, onClose }) => (
  <Container>
    <Title>{title}</Title>

    <IconButton color="#7b91a6" hoverColor="#fff" onClick={onClose}>
      <CloseIcon />
    </IconButton>
  </Container>
)

export default Header
