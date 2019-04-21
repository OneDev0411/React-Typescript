import React from 'react'
import PropTypes from 'prop-types'

import { BasicDropdown } from 'components/BasicDropdown'

import {
  InputContainer,
  InputLabel,
  InputRequired,
  InputError
} from '../styled'

SelectInput.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  label: PropTypes.string.isRequired,
  input: PropTypes.object,
  styles: PropTypes.object,
  dropdownOptions: PropTypes.object,
  meta: PropTypes.object,
  defaultSelectedItem: PropTypes.object,
  noBorder: PropTypes.bool,
  isRequired: PropTypes.bool,
  container: PropTypes.element
}

SelectInput.defaultProps = {
  input: null,
  meta: {},
  styles: {},
  dropdownOptions: {},
  defaultSelectedItem: null,
  noBorder: true,
  isRequired: false,
  container: InputContainer
}

export function SelectInput(props) {
  const handleChange = item =>
    props.onChange
      ? props.onChange(item)
      : item => props.input.onChange(item.value)

  return (
    <props.container style={props.style}>
      <InputLabel hasError={props.meta.submitFailed && props.meta.error}>
        {props.label} <InputRequired>{props.isRequired && '*'}</InputRequired>
      </InputLabel>

      <BasicDropdown
        buttonStyle={{
          padding: 0
        }}
        defaultSelectedItem={props.defaultSelectedItem}
        items={props.items}
        noBorder={props.noBorder}
        hasSearch={props.searchable}
        onChange={handleChange}
        {...props.dropdownOptions}
      />

      {props.meta.error && props.meta.touched && (
        <InputError>{props.meta.error}</InputError>
      )}
    </props.container>
  )
}
