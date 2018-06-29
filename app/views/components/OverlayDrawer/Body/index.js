import React from 'react'
import { Container } from './styled'

const Body = ({ children, showFooter }) => (
  <Container showFooter={showFooter}>{children}</Container>
)

export default Body
