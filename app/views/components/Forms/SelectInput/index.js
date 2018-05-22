import React from 'react'
import Select from 'react-select'

import {
  InputContainer,
  InputLabel,
  InputRequired,
  InputError
} from '../styled'

export const SelectInput = ({
  input,
  meta,
  options,
  placeholder,
  onChange,
  defaultValue,
  isRequired = false,
  className = '',
  searchable = false,
  clearable = false,
  Container = InputContainer,
  ...rest
}) => (
  <Container>
    <InputLabel hasError={meta.submitFailed && meta.error}>
      {placeholder} <InputRequired>{isRequired && '*'}</InputRequired>
    </InputLabel>

    <Select
      className={className}
      searchable={searchable}
      clearable={clearable}
      placeholder={placeholder}
      value={input.value || defaultValue}
      onChange={onChange}
      options={options}
      {...rest}
    />

    {meta.error && meta.touched && <InputError>{meta.error}</InputError>}
  </Container>
)
