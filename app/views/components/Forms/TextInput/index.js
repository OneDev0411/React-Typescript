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
  labelText,
  hasLabel = true,
  showError = true,
  highlightOnError = false,
  Container = InputContainer,
  ...rest
}) => (
  <Container>
    {hasLabel && (
      <InputLabel hasError={meta.submitFailed && meta.error}>
        {labelText || placeholder}&nbsp;
        <InputRequired>{isRequired && '*'}</InputRequired>
      </InputLabel>
    )}

    <InputField
      {...input}
      autocomplete={false}
      placeholder={placeholder}
      hasError={highlightOnError && meta.submitFailed && meta.error}
      {...rest}
    />

    {showError &&
      meta.error &&
      meta.touched && <InputError>{meta.error}</InputError>}
  </Container>
)
