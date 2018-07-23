import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'

import { Container, Label, LabelNote, ErrorMessage } from '../styled'

const TextInput = styled.input`
  width: 100%;
  padding: 0;
  font-size: 1.8rem;
  border-width: 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #cad4db;
  }
`

TextField.propTypes = {
  format: PropTypes.func,
  hint: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelNote: PropTypes.string,
  name: PropTypes.string.isRequired,
  parse: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  validate: PropTypes.func
}

TextField.defaultProps = {
  format: t => t,
  hint: '',
  labelNote: '',
  parse: t => t,
  placeholder: '',
  required: false,
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
          <Container>
            <Label htmlFor={id} required={props.required}>
              {props.label}
              {props.labelNote &&
                !props.required && <LabelNote>{props.labelNote}</LabelNote>}
            </Label>
            <TextInput
              {...input}
              id={id}
              placeholder={props.placeholder}
              type="text"
              autoComplete="off"
            />
            {hasError && <ErrorMessage>{meta.error}</ErrorMessage>}
            {meta.active &&
              props.hint && (
                <div
                  style={{
                    marginTop: '0.5em',
                    padding: '0.5em',
                    borderRadius: 3,
                    backgroundColor: '#f6fafb'
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
