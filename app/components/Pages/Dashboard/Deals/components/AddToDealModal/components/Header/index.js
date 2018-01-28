import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`

const Title = styled.h3`
  margin: 0;
  font-size: 1.7em;
  font-weight: 500;
  color: #26465e;
`

export default function Header(props) {
  return (
    <Container>
      <Title>{props.title}</Title>
      {props.children}
    </Container>
  )
}
