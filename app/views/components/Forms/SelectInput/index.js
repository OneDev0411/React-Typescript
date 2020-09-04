import React from 'react'
import PropTypes from 'prop-types'
import { mdiChevronDown } from '@mdi/js'

import { BasicDropdown } from 'components/BasicDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { InputContainer, InputLabel, InputRequired } from '../styled'

import { MenuButton } from './styled'
import { FieldError } from '../../final-form-fields/FieldError'

SelectInput.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string
    }).isRequired
  ).isRequired,
  label: PropTypes.string.isRequired,
  input: PropTypes.object,
  onChange: PropTypes.func,
  styles: PropTypes.object,
  dropdownOptions: PropTypes.object,
  dropdownStyle: PropTypes.object,
  meta: PropTypes.object,
  selectedItem: PropTypes.object,
  defaultSelectedItem: PropTypes.object,
  noBorder: PropTypes.bool,
  isRequired: PropTypes.bool,
  isVisible: PropTypes.bool,
  showError: PropTypes.bool,
  hasBottomLine: PropTypes.bool,
  container: PropTypes.oneOfType([PropTypes.element, PropTypes.object])
}

SelectInput.defaultProps = {
  input: null,
  meta: {},
  styles: {},
  dropdownOptions: {},
  dropdownStyle: {},
  selectedItem: null,
  defaultSelectedItem: null,
  noBorder: true,
  isRequired: false,
  isVisible: true,
  showError: true,
  hasBottomLine: true,
  onChange: null,
  container: InputContainer
}

export function SelectInput(props) {
  if (!props.isVisible) {
    return null
  }

  const handleChange = item =>
    props.onChange ? props.onChange(item) : props.input.onChange(item.value)

  const selectedItem = props.input.value
    ? props.items.find(item => item.value === props.input.value)
    : props.items[0]

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
          ...(props.hasBottomLine && {
            borderBottom: '1px solid #dce5eb',
            height: '2rem',
            paddingBottom: '0.25rem'
          }),
          ...props.dropdownStyle
        }}
        buttonRenderer={props => (
          <MenuButton onClick={props.onClick}>
            <span>{props.text}</span>
            <SvgIcon path={mdiChevronDown} />
          </MenuButton>
        )}
        selectedItem={selectedItem}
        defaultSelectedItem={selectedItem}
        items={props.items}
        noBorder={props.noBorder}
        hasSearch={props.searchable}
        onChange={handleChange}
        {...props.dropdownOptions}
      />

      {props.showError && <FieldError name={props.input.name} />}
    </props.container>
  )
}
