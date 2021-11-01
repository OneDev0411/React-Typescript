import React from 'react'

import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  padding: 1.25rem 1.5rem;
`

export default props => <Container {...props}>{props.children}</Container>
