import React from 'react'
import styled from 'styled-components'

const Container = styled.div``

const Title = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
  line-height: 40px;
`

export const TableSummary = ({ Component, ...rest }) => (
  <Container>
    <Title>{Component && <Component {...rest} />}</Title>
  </Container>
)
