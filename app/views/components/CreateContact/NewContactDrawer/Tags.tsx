import React from 'react'

import { Field } from 'react-final-form'

import { Container, Label } from 'components/final-form-fields/styled'
import { TagSelectorTextField } from 'components/TagSelector'

export const Tags = () => (
  <Container>
    <Label>Tags</Label>
    <Field
      name="tags"
      render={({ input }) => (
        <TagSelectorTextField value={input.value} onChange={input.onChange} />
      )}
    />
  </Container>
)
