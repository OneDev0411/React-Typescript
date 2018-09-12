import React from 'react'
import styled from 'styled-components'
import { Field } from 'react-final-form'

import { grey } from '../../../../../../utils/colors'

const Input = styled.input`
  width: 100%;
  padding: 0;
  border-width: 0;

  margin-bottom: 3.5rem;
  font-size: 1.5rem;
  font-weight: 500;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${grey.A550};
  }
`

export function Title() {
  return (
    <Field
      name="title"
      render={({ input }) => (
        <Input {...input} type="text" placeholder="Add a descriptive title…" />
      )}
    />
  )
}
