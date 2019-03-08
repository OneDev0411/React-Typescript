import React from 'react'
import PropTypes from 'prop-types'

import { Label, Input, CheckMarkBox, CheckMark } from './styled'

Checkbox.propTypes = {
  size: PropTypes.number,
  inputProps: PropTypes.shape(),
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  checkboxStyle: PropTypes.shape(),
  containerStyle: PropTypes.shape()
}

Checkbox.defaultProps = {
  inputProps: {},
  size: 16,
  checkboxStyle: { marginRight: '0.5em' },
  containerStyle: {}
}

export function Checkbox(props) {
  const { id, size, checked } = props

  return (
    <Label htmlFor={id} style={props.containerStyle}>
      <Input
        id={id}
        type="checkbox"
        {...props.inputProps}
        onChange={props.onChange}
      />

      <CheckMarkBox size={size} checked={checked} style={props.checkboxStyle}>
        {checked && <CheckMark />}
      </CheckMarkBox>

      {props.children}
    </Label>
  )
}
