import React from 'react'

import {
  InputContainer,
  InputError,
  InputRequired,
  InputLabel
} from '../styled'
import { InputField } from './styled'

export const TextInput = ({
  input,
  meta,
  isRequired,
  placeholder,
  Container = InputContainer,
  ...rest
}) => (
  <Container>
    <InputLabel hasError={meta.submitFailed && meta.error}>
      {placeholder} <InputRequired>{isRequired && '*'}</InputRequired>
    </InputLabel>

    <InputField
      {...input}
      autocomplete={false}
      placeholder={placeholder}
      {...rest}
    />

    {meta.error && meta.touched && <InputError>{meta.error}</InputError>}
  </Container>
)
