import React from 'react'
import PropTypes from 'prop-types'

import { InputContainer, InputLabel, InputRequired } from '../styled'

import { FormattedInputField, InputField } from './styled'
import { FieldError } from '../../final-form-fields/FieldError'

TextInput.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  style: PropTypes.object,
  meta: PropTypes.object,
  hasLabel: PropTypes.bool,
  isRequired: PropTypes.bool,
  isVisible: PropTypes.bool,
  showError: PropTypes.bool,
  highlightOnError: PropTypes.bool,
  format: PropTypes.object,
  container: PropTypes.oneOfType([PropTypes.element, PropTypes.object])
}

TextInput.defaultProps = {
  input: {},
  meta: {},
  style: {},
  hasLabel: true,
  isRequired: false,
  isVisible: true,
  showError: true,
  highlightOnError: true,
  format: null,
  container: InputContainer
}

export function TextInput({ input, ...props }) {
  const inputProps = {
    autoComplete: 'Off',
    hasError:
      props.highlightOnError && props.meta.submitFailed && props.meta.error,
    ...input,
    ...props
  }
  const name = (input && input.name) || props.name

  return (
    <props.container
      style={{
        ...props.style,
        display: props.isVisible ? 'block' : 'none'
      }}
    >
      {props.hasLabel && (
        <InputLabel hasError={props.meta.submitFailed && props.meta.error}>
          {props.label || props.placeholder}
          <InputRequired>{props.isRequired && '*'}</InputRequired>
        </InputLabel>
      )}

      {props.format ? (
        <FormattedInputField
          {...inputProps}
          options={props.format}
          onChange={e => input.onChange(e.target.rawValue)}
        />
      ) : (
        <InputField {...inputProps} />
      )}

      {props.showError && <FieldError name={name} />}
    </props.container>
  )
}
