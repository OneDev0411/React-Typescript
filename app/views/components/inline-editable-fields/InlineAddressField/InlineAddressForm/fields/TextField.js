import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { Label, Input } from './styled'

TextField.propTypes = {
  style: PropTypes.shape(),
  validate: PropTypes.func,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}

TextField.defaultProps = {
  style: {},
  validate() {}
}

export function TextField(props) {
  const id = `${props.name}_text-field`

  return (
    <Field
      name={props.name}
      validate={props.validate}
      render={({ input }) => (
        <div style={props.style}>
          <Label htmlFor={id}>{props.label}</Label>
          <Input
            {...input}
            id={id}
            placeholder={props.placeholder}
            type="text"
            autoComplete="off"
          />
        </div>
      )}
    />
  )
}
