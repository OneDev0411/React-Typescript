import React from 'react'
import styled from 'styled-components'

import IconDateSigned from 'components/SvgIcons/FormDateSigned/IconDateSigned'

const Container = styled.div`
  max-height: 100%;
  text-align: center;
`

export default function DateAssignment({ height, roleColor }) {
  return (
    <Container>
      <IconDateSigned style={{ height: `${height}px` }} fillColor={roleColor} />
    </Container>
  )
}
