import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { Container, Label, Input } from './styled'

TextField.propTypes = {
  width: PropTypes.number,
  style: PropTypes.shape(),
  validate: PropTypes.func,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}

TextField.defaultProps = {
  style: {},
  width: 25,
  validate() {}
}

export function TextField(props) {
  const id = `${props.name}_text-field`

  return (
    <Field
      name={props.name}
      validate={props.validate}
      render={({ input }) => (
        <Container width={props.width} style={props.style}>
          <Label htmlFor={id}>{props.label}</Label>
          <Input
            {...input}
            id={id}
            type="text"
            autoComplete="off"
            placeholder={props.placeholder}
          />
        </Container>
      )}
    />
  )
}
