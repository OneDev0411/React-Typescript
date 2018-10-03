import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'

import { Container, Title, ErrorMessage } from '../styled'
import { grey } from '../../../../../../../../../../views/utils/colors'

const TextInput = styled.input`
  width: 100%;
  padding: 0;
  border-width: 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${grey.A550};
  }
`

TextField.propTypes = {
  attribute: PropTypes.shape().isRequired,
  format: PropTypes.func,
  parse: PropTypes.func,
  placeholder: PropTypes.string,
  validate: PropTypes.func
}

TextField.defaultProps = {
  format: t => t,
  parse: t => t,
  placeholder: '',
  validate: () => undefined
}

export function TextField(props) {
  const { attribute_def } = props.attribute
  const id = `${attribute_def.section}_modal__${attribute_def.id}`

  return (
    <Field
      name={attribute_def.id}
      format={value => {
        value =
          (value && value.value) || (typeof value === 'string' && value) || ''

        return props.format(value)
      }}
      parse={value => ({
        attribute: props.attribute,
        value: value ? props.parse(value) : ''
      })}
      validate={value =>
        value
          ? props.validate(value.value == null ? value : value.value)
          : value
      }
      render={({ input, meta }) => {
        const hasError = meta.error && meta.touched

        return (
          <Container>
            <Title required={attribute_def.required} htmlFor={id}>
              {attribute_def.label}
            </Title>
            <TextInput
              {...input}
              id={id}
              readOnly={!attribute_def.editable}
              placeholder={props.placeholder}
              type="text"
            />
            {hasError && <ErrorMessage>{meta.error}</ErrorMessage>}
          </Container>
        )
      }}
    />
  )
}
