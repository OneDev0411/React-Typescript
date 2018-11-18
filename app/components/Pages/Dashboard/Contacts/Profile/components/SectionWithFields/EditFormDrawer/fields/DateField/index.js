import React from 'react'
import PropTypes from 'prop-types'

import { DateField as DateFieldComponent } from 'components/final-form-fields/DateField'

import { Container, Title } from '../styled'

DateField.propTypes = {
  attribute: PropTypes.shape().isRequired
}

export function DateField(props) {
  const { attribute_def } = props.attribute

  return (
    <Container>
      <Title required={attribute_def.required}>{attribute_def.label}</Title>
      <DateFieldComponent yearIsOptional name={props.name} />
    </Container>
  )
}
