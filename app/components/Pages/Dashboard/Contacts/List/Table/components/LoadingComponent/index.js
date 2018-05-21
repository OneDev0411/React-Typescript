import React from 'react'
import styled from 'styled-components'

import Loading from '../../../../../../../Partials/Loading'

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 2em;
  bottom: 0;
  opacity: ${props => (props.loading ? 1 : 0)};
  z-index: ${props => (props.loading ? 2 : -1)};
  pointer-events: ${props => (props.loading ? 'all' : 'none')};
  will-change: opacity;
  transition: opacity 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
`

export function LoadingComponent(props) {
  return (
    <Container {...props}>
      <Loading style={{ marginTop: '1.5em' }} />
    </Container>
  )
}
