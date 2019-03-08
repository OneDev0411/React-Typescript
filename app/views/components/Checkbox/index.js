import React from 'react'
import PropTypes from 'prop-types'

import { Label, Input, CheckMark } from './styled'

Checkbox.propTypes = {
  size: PropTypes.number,
  inputProps: PropTypes.shape(),
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  margin: PropTypes.string
}

Checkbox.defaultProps = {
  inputProps: {},
  margin: '0 1em 0 0',
  size: 16
}

export function Checkbox(props) {
  const { id, size, checked } = props

  return (
    <Label htmlFor={id} size={size} checked={checked} margin={props.margin}>
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
