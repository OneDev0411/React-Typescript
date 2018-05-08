import React from 'react'
import {
  InputContainer,
  InputError,
  InputRequired,
  InputLabel,
  InputField
} from '../../styles'

export const TextInput = ({
  input,
  meta,
  isRequired,
  placeholder,
  ...rest
}) => (
  <InputContainer>
    <InputLabel hasError={meta.submitFailed && meta.error}>
      {placeholder} <InputRequired>{isRequired && '*'}</InputRequired>
    </InputLabel>

    <InputField
      {...input}
      {...rest}
      autocomplete={false}
      placeholder={placeholder}
    />

    {meta.error && meta.touched && <InputError>{meta.error}</InputError>}
  </InputContainer>
)
