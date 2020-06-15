import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { TextField as Input } from '@material-ui/core'

import { Container, Label, LabelNote, ErrorMessage } from '../styled'
import { brandBackground } from '../../../utils/colors'

TextField.propTypes = {
  format: PropTypes.func,
  hint: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelNote: PropTypes.string,
  name: PropTypes.string.isRequired,
  parse: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  style: PropTypes.shape(),
  validate: PropTypes.func
}

TextField.defaultProps = {
  format: t => t || '',
  hint: '',
  labelNote: '',
  parse: t => t || '',
  placeholder: '',
  required: false,
  style: {},
  validate: () => undefined
}

export function TextField(props) {
  const id = `${props.name}_text-field`

  return (
    <Field
      name={props.name}
      format={props.format}
      parse={props.parse}
      validate={props.validate}
      render={({ input, meta }) => {
        const hasError = meta.error && meta.touched

        return (
          <Container style={props.style}>
            <Label htmlFor={id} required={props.required}>
              {props.label}
              {props.labelNote && !props.required && (
                <LabelNote>{props.labelNote}</LabelNote>
              )}
            </Label>
            <Input
              autoComplete="disabled"
              {...input}
              id={id}
              placeholder={props.placeholder}
              data-test={`text-field-${props.name}`}
              type="text"
            />
            {hasError && <ErrorMessage>{meta.error}</ErrorMessage>}
            {meta.active && props.hint && (
              <div
                style={{
                  fontSize: '0.875rem',
                  marginTop: '1rem',
                  padding: '1rem',
                  borderRadius: 3,
                  backgroundColor: brandBackground
                }}
              >
                {props.hint}
              </div>
            )}
          </Container>
        )
      }}
    />
  )
}
