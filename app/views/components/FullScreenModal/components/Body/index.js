import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  height: calc(100vh - 56px);
  overflow-x: hidden;
  overflow-y: scroll;
`

export default function Body(props) {
  return (
    <Container className="c-full-screen-modal__body" {...props}>
      {props.children}
    </Container>
  )
}
