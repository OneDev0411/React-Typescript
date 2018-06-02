import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #f8fafb;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.09);
  width: ${props => (props.isOpen ? 180 : 0)}px;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  max-height: 100vh;
  overflow: auto;
  transition: 0.3s all ease-in;
`

export const Menu = ({ children, isOpen }) => (
  <Container isOpen={isOpen}>{children}</Container>
)
