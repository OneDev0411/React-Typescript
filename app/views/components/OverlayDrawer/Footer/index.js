import React from 'react'
import { Container } from './styled'

const Footer = ({ showFooter, children, style }) =>
  showFooter && <Container style={style}>{children}</Container>

export default Footer
