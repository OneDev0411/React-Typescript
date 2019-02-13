import React from 'react'
import PropTypes from 'prop-types'

import { Label, Input, CheckMark } from './styled'

Checkbox.propTypes = {
  size: PropTypes.number,
  inputProps: PropTypes.shape(),
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

Checkbox.defaultProps = {
  size: 16,
  inputProps: {}
}

export function Checkbox(props) {
  const { id, size, checked } = props

  return (
    <Label htmlFor={id} size={size} checked={checked}>
      <Input
        id={id}
        type="checkbox"
        {...props.inputProps}
        onChange={props.onChange}
      />
      {checked && <CheckMark size={size} />}
      {props.children}
    </Label>
  )
}
