import React from 'react'
import styled from 'styled-components'

import Loading from '../../../../../../../Partials/Loading'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  /* Fix IE issue: loading wasn't center */
  .sk-circle {
    margin: 100px;
  }

  ${props =>
    props.isFetchingMore &&
    `
    .sk-circle {
      margin: 30px;
    }
  `};
`

export function LoadingComponent(props) {
  return (
    <Container
      {...props}
      style={{ minHeight: props.isFetchingMore ? '5vh' : '10vh' }}
    >
      <Loading />
    </Container>
  )
}
