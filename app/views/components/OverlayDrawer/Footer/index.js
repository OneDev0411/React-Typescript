import React from 'react'
import { Container } from './styled'

const Footer = ({ showFooter, children, style }) =>
  showFooter && (
    <Container alignCenter justifyBetween style={style}>
      {children}
    </Container>
  )

export default Footer
