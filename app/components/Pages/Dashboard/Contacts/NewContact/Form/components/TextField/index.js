import React from 'react'
import styled from 'styled-components'

import { Container, Title, ErrorMessage } from '../../styled-components/field'
import { placeholderColor } from '../../../../../../../../views/utils/colors'

const TextInput = styled.input`
  width: 100%;
  padding: 0;
  font-size: 1.125rem;
  border: none;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${placeholderColor};
  }
`

export function TextField({ input, meta, title, isRequired }) {
  const { error, touched } = meta
  const hasError = error && touched

  return (
    <Container>
      <Title required={isRequired} htmlFor={`new-contact__${input.name}`}>
        {title}
      </Title>
      <TextInput
        {...input}
        id={`new-contact__${input.name}`}
        placeholder={title}
        autoComplete="off"
        type="text"
      />
      {hasError && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  )
}
