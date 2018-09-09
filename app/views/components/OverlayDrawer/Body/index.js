import React from 'react'
import { Container } from './styled'

const Body = ({ children, style, showFooter }) => (
  <Container showFooter={showFooter} style={style}>
    {children}
  </Container>
)

export default Body
