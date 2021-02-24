import React from 'react'
import { Field } from 'react-final-form'

import { Container, Label } from 'components/final-form-fields/styled'
import { BaseTagSelector } from 'components/TagSelector'

export const Tags = () => (
  <Container>
    <Label>Tags</Label>
    <Field
      name="tags"
      render={({ input }) => (
        <BaseTagSelector value={input.value} onChange={input.onChange} />
      )}
    />
  </Container>
)
