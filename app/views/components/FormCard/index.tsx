import React from 'react'

import { Container, Title, Content } from './styled'

interface Props {
  title?: string
  children: React.ReactNode
}

export default function FormCard({ title, children }: Props) {
  return (
    <Container>
      {title && (
        <div>
          <Title>{title}</Title>
        </div>
      )}
      <Content>{children}</Content>
    </Container>
  )
}
