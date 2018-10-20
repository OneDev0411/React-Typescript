import React from 'react'
import { Container } from './styled'

const Footer = ({ showFooter, children, ...props }) =>
  showFooter && (
    <Container alignCenter justifyBetween {...props}>
      {children}
    </Container>
  )

export default Footer
