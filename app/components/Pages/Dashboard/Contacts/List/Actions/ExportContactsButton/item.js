import React from 'react'

import { Container, Column, ItemTitle, ItemDescription } from './styled'

export default function({ title, description, icon: Icon, ...rest }) {
  return (
    <Container {...rest}>
      <Column>
        <Icon />
      </Column>
      <Column>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </Column>
    </Container>
  )
}
