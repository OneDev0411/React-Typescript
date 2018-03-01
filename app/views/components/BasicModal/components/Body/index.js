import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  height: calc(100vh - 96px);
  padding: 16px;
  overflow-x: hidden;
  overflow-y: scroll;

  @media screen and (min-width: 48em) {
    height: 314px;
  }
`

export default function Body(props) {
  return <Container {...props}>{props.children}</Container>
}
