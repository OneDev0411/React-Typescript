import React from 'react'

import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  padding: ${props => props.theme.spacing(1.25, 1.5)};
`

export default props => <Container {...props}>{props.children}</Container>
