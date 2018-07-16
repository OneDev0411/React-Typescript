import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { Dropdown } from '../../Dropdown'
import { Container, Label, LabelNote, ErrorMessage } from '../styled'

Select.propTypes = {
  format: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  label: PropTypes.string.isRequired,
  labelNote: PropTypes.string,
  name: PropTypes.string.isRequired,
  parse: PropTypes.func,
  required: PropTypes.bool,
  validate: PropTypes.func
}

Select.defaultProps = {
  format: t => t,
  labelNote: '',
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
            <Label required={props.required}>
              <span>{props.label}</span>
              {props.labelNote &&
                !props.required && <LabelNote>{props.labelNote}</LabelNote>}
            </Label>
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