import React, { ReactNode } from 'react'

import { Container, Title, Content } from './styled'

interface Props {
  title?: string
  noBorder?: boolean
  children: ReactNode
}

export default function FormCard({ title, noBorder, children }: Props) {
  return (
    <Container>
      {title && (
        <div>
          <Title>{title}</Title>
        </div>
      )}
      <Content noBorder={noBorder}>{children}</Content>
    </Container>
  )
}
