import React from 'react'
import PropTypes from 'prop-types'

import { BasicDropdown } from 'components/BasicDropdown'
import IconDrop from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import {
  InputContainer,
  InputLabel,
  InputRequired,
  InputError
} from '../styled'

import { MenuButton } from './styled'

SelectInput.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string
    }).isRequired
  ).isRequired,
  label: PropTypes.string.isRequired,
  input: PropTypes.object,
  styles: PropTypes.object,
  dropdownOptions: PropTypes.object,
  dropdownStyle: PropTypes.object,
  meta: PropTypes.object,
  defaultSelectedItem: PropTypes.object,
  noBorder: PropTypes.bool,
  isRequired: PropTypes.bool,
  isVisible: PropTypes.bool,
  container: PropTypes.element
}

SelectInput.defaultProps = {
  input: null,
  meta: {},
  styles: {},
  dropdownOptions: {},
  dropdownStyle: {},
  defaultSelectedItem: null,
  noBorder: true,
  isRequired: false,
  isVisible: true,
  container: InputContainer
}

export function SelectInput(props) {
  if (props.isVisible === false) {
    return false
  }

  const handleChange = item =>
    props.onChange
      ? props.onChange(item)
      : item => props.input.onChange(item.value)

  return (
    <props.container
      style={{
        justifyContent: 'flex-start',
        ...props.style
      }}
    >
      <InputLabel hasError={props.meta.submitFailed && props.meta.error}>
        {props.label} <InputRequired>{props.isRequired && '*'}</InputRequired>
      </InputLabel>

      <BasicDropdown
        style={{
          height: '1.7rem',
          ...props.dropdownStyle
        }}
        buttonRenderer={props => (
          <MenuButton onClick={props.onClick}>
            <span>{props.text}</span>
            <IconDrop />
          </MenuButton>
        )}
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
