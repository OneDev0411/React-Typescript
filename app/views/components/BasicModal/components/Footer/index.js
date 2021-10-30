import React from 'react'

import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`

export default props => (
  <Container style={props.style}>{props.children}</Container>
)
