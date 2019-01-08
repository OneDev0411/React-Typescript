import React from 'react'

import IconComment from 'components/SvgIcons/Comment/IconComment'

import { Container } from './styled'

export function EmptyState() {
  return (
    <Container>
      <IconComment style={{}} />
      Add some comment to this Checklist or Notify Office
    </Container>
  )
}
