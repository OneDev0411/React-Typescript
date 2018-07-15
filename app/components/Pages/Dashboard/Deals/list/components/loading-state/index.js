import React from 'react'
import styled from 'styled-components'
import Loading from '../../../../../../Partials/Loading'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #dce5eb;
  border-left: none;
  border-right: none;
  padding-top: 15px;

  .sk-circle {
    margin: 5px auto;
  }
`

const Title = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #62778c;
  margin: 15px;
`

export default () => (
  <Container>
    <Loading />
    <Title>Searching for Deals...</Title>
  </Container>
)
