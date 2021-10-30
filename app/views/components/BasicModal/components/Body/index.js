import React from 'react'

import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  padding: 1.25rem 1rem;
  overflow-x: hidden;
  overflow-y: scroll;
`

export default props => <Container {...props}>{props.children}</Container>
