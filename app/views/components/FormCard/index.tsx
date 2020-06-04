import React, { ReactNode } from 'react'
import { Typography, Box } from '@material-ui/core'

import { Container, Content } from './styled'

interface Props {
  title?: string
  noBorder?: boolean
  children: ReactNode
}

export default function FormCard({ title, noBorder, children }: Props) {
  return (
    <Container>
      {title && (
        <Box marginBottom={1}>
          <Typography variant="h6">{title}</Typography>
        </Box>
      )}
      <Content noBorder={noBorder}>{children}</Content>
    </Container>
  )
}
