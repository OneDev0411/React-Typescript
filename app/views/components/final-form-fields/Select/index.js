import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { Dropdown } from '../../Dropdown'
import { Container, Title, ErrorMessage } from '../styled'

Select.propTypes = {
  format: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  parse: PropTypes.func,
  required: PropTypes.bool,
  validate: PropTypes.func
}

Select.defaultProps = {
  format: t => t,
  parse: t => t,
  required: false,
  validate: () => undefined
}

export function Select(props) {
  return (
    <Field
      name={props.name}
      format={props.format}
      parse={props.parse}
      validate={props.validate}
      render={({ input, meta }) => {
        const { error, touched } = meta
        const hasError = error && touched

        return (
          <Container>
            <Title required={props.required}>{props.label}</Title>
            <Dropdown
              fullWidth
              input={input}
              items={[{ title: '-Select-', value: '-Select-' }, ...props.items]}
            />
            {hasError && <ErrorMessage>{error}</ErrorMessage>}
          </Container>
        )
      }}
    />
  )
}
