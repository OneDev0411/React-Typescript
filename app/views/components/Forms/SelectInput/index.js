import React from 'react'
import Select from 'react-select'

import {
  InputContainer,
  InputLabel,
  InputRequired,
  InputError
} from '../styled'
import { BasicDropdown } from 'components/BasicDropdown'

function handleChange(data, input, onChange) {
  if (onChange) {
    return onChange(data)
  }

  input.onChange(data ? data.value : null)
}

function itemToString(item) {
  return item.label
}

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
    {/* <BasicDropdown
      // buttonSize={this.props.buttonSize}
      fullWidth
      items={options}
      itemToString={itemToString}
      onChange={data => handleChange(data, input, onChange)}
      // buttonIcon={<InputRequired>{isRequired && '*'}</InputRequired>}
      buttonText="Add a Contact"
      // style={this.props.style}
      defaultSelectedItem={simpleItems[0]}
    /> */}
    <Select
      menuIsOpen
      // openMenuOnFocus
      // autoFocus
      closeMenuOnSelect={false}
      className={className}
      searchable={searchable}
      clearable={clearable}
      placeholder={placeholder}
      value={input.value || defaultValue}
      onChange={data => handleChange(data, input, onChange)}
      options={options}
      {...rest}
    />

    {meta.error && meta.touched && <InputError>{meta.error}</InputError>}
  </Container>
)
