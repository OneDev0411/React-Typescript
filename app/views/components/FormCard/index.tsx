import React, { ReactNode } from 'react'
import { Typography } from '@material-ui/core'

import { Container, Content } from './styled'

interface Props {
  title?: string
  noBorder?: boolean
  children: ReactNode
}

export default function FormCard({ title, noBorder, children }: Props) {
  return (
    <Container>
      {title && <Typography variant="h6">{title}</Typography>}
      <Content noBorder={noBorder}>{children}</Content>
    </Container>
  )
}
