import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'

import { Container, Label, LabelNote, ErrorMessage } from '../styled'

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  display: block;
  padding: 0;
  line-height: 1.5;
  border-width: 0;
  font-size: 2rem;
  resize: none;
  overflow: auto;
  color: #26465e;

  &:focus {
    outline: none;
  }
`

TextAreaField.propTypes = {
  hint: PropTypes.string,
  label: PropTypes.string,
  labelNote: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool
}

TextAreaField.defaultProps = {
  hint: '',
  label: '',
  labelNote: '',
  placeholder: '',
  required: false
}

export function TextAreaField(props) {
  const id = `${props.name}_text-field`

  return (
    <Field
      name={props.name}
      render={({ input, meta }) => {
        const hasError = meta.error && meta.touched

        return (
          <Container>
            {props.label && (
              <Label htmlFor={id} required={props.required}>
                {props.label}
                {props.labelNote &&
                  !props.required && <LabelNote>{props.labelNote}</LabelNote>}
              </Label>
            )}
            <TextArea {...input} id={id} placeholder={props.placeholder} />
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
