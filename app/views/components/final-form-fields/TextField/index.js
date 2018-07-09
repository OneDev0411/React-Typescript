import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'

import { Container, Title, ErrorMessage } from '../styled'

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
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  parse: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  validate: PropTypes.func
}

TextField.defaultProps = {
  format: t => t,
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
            <Title required={props.required} htmlFor={id}>
              {props.label}
            </Title>
            <TextInput
              {...input}
              id={id}
              placeholder={props.placeholder}
              type="text"
              autoComplete="off"
            />
            {hasError && <ErrorMessage>{meta.error}</ErrorMessage>}
          </Container>
        )
      }}
    />
  )
}
