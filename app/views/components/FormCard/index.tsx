import React from 'react'

import { Container, Title, Content } from './styled'

export default function FormCard({ title, children }) {
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
