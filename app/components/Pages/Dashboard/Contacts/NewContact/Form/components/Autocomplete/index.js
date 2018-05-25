import React from 'react'

import { Container, Title } from '../../styled-components/field'
import { GeneralAutocomplete } from '../../../../../../../../views/components/Forms/GeneralAutocomplete'

export function Autocomplete({ title, ...props }) {
  return (
    <Container>
      <Title>{title}</Title>
      <GeneralAutocomplete {...props} />
    </Container>
  )
}
