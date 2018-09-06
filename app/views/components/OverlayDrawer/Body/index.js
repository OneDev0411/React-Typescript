import React from 'react'
import { Container } from './styled'

const Body = ({ children, showFooter, style }) => (
  <Container style={style} showFooter={showFooter}>
    {children}
  </Container>
)

export default Body
