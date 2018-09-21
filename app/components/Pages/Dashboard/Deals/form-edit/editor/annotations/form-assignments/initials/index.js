import React from 'react'
import styled from 'styled-components'

import IconInitial from 'components/SvgIcons/FormInitial/IconInitial'

const Container = styled.div`
  max-height: 100%;
  text-align: center;
`

export default function InitialsAssignment({ height, roleColor }) {
  return (
    <Container>
      <IconInitial style={{ height: `${height}px` }} fillColor={roleColor} />
    </Container>
  )
}
