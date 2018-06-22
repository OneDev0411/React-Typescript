import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 5px 0;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #dce5eb;
  color: #8da2b5;
  font-size: 17px;
  height: 48px;
  opacity: 0.4;
`

const EmptyState = () => (
  <Container>
    <Row />
    <Row />
    <Row>No activities for this date.</Row>
    <Row />
    <Row />
  </Container>
)

export default EmptyState
