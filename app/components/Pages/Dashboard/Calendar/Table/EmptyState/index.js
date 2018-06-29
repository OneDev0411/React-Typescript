import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 5px 0;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8da2b5;
  font-size: 17px;
  min-height: 70px;
  opacity: 0.4;
`

const EmptyState = () => (
  <Container>
    <Row>No activities for this date.</Row>
  </Container>
)

export default EmptyState
