import React from 'react'

import { Container } from './styled'

export function Template({ template }) {
  return (
    <Container>
      <img src={`${template.url}/thumbnail.png`} alt={template.template_type} />
    </Container>
  )
}
