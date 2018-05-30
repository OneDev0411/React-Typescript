import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #f8fafb;
  box-shadow: -1px 0 0 0 rgba(0, 0, 0, 0.09);
  width: 180px;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  max-height: 100vh;
  overflow: auto;
`

export const Menu = ({ children, isOpen }) => (
  <Container isOpen={isOpen}>{children}</Container>
)
