import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: scroll;

  @media screen and (min-width: 48em) {
    height: ${({ noFooter }) => (noFooter ? 410 : 314)}px
`

export default props => <Container {...props}>{props.children}</Container>
