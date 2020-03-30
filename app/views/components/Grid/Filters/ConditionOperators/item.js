import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  padding: 0.6rem 1rem;
  font-weight: normal;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.palette.secondary.main};
    font-weight: 500;
  }
`

export default function({ title, description, ...rest }) {
  return (
    <Container {...rest}>
      <div>{title}</div>
    </Container>
  )
}
