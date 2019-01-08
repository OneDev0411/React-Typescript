import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { Input, Label, Radio, Icon } from './styled'

RadioField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export function RadioField(props) {
  const type = 'radio'

  return (
    <Field
      name={props.name}
      type={type}
      value={props.value}
      render={({ input }) => (
        <Radio htmlFor={props.id} style={props.style}>
          <Input {...input} id={props.id} type={type} />
          <Icon />
          <Label>{props.label}</Label>
        </Radio>
      )}
    />
  )
}
