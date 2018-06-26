import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'

import { Container, Title, ErrorMessage } from '../../styled-components/field'

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
  attribute: PropTypes.shape().isRequired,
  validate: PropTypes.func
}

TextField.defaultTypes = {
  validate: () => ({})
}

export function TextField(props) {
  const { attribute_def } = props.attribute
  const id = `${attribute_def.section}_modal__${attribute_def.name}`

  return (
    <Field
      validate={props.validate}
      name={attribute_def.name}
      format={value => value && value.value}
      parse={value => ({
        attribute: props.attribute,
        value: value == null ? '' : value
      })}
      render={({ input, meta }) => {
        const { error, touched } = meta
        const hasError = error && touched

        return (
          <Container>
            <Title required={attribute_def.required} htmlFor={id}>
              {attribute_def.label}
            </Title>
            <TextInput
              {...input}
              id={id}
              readOnly={!attribute_def.editable}
              placeholder={attribute_def.label}
              type="text"
            />
            {hasError && <ErrorMessage>{error}</ErrorMessage>}
          </Container>
        )
      }}
    />
  )
}
