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
  label,
  hasLabel = true,
  showError = true,
  highlightOnError = false,
  style,
  Container = InputContainer,
  ...rest
}) => (
  <Container style={style}>
    {hasLabel && (
      <InputLabel hasError={meta.submitFailed && meta.error}>
        {label || placeholder}
        &nbsp;
        <InputRequired>{isRequired && '*'}</InputRequired>
      </InputLabel>
    )}

    <InputField
      {...input}
      autoComplete="Off"
      placeholder={placeholder}
      hasError={highlightOnError && meta.submitFailed && meta.error}
      {...rest}
    />

    {showError && meta.error && meta.touched && (
      <InputError>{meta.error}</InputError>
    )}
  </Container>
)
