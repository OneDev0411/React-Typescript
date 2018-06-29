import React from 'react'
import { Container } from './styled'

const Footer = ({ showFooter, children }) =>
  showFooter && <Container>{children}</Container>

export default Footer
