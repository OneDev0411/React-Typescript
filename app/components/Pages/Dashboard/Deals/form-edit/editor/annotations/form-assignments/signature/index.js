import React from 'react'
import styled from 'styled-components'

import IconSign from 'components/SvgIcons/FormSign/IconSign'

const Container = styled.div`
  max-height: 100%;
  text-align: center;
`

export default function SignatureAssignment({ height, color }) {
  return (
    <Container>
      <IconSign style={{ height: `${height}px` }} fillColor={color} />
    </Container>
  )
}
