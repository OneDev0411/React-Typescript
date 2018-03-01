import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`

export default function Footer(props) {
  return <Container style={props.style}>{props.children}</Container>
}
