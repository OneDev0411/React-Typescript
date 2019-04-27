import React from 'react'
import PropTypes from 'prop-types'

import {
  InputContainer,
  InputError,
  InputRequired,
  InputLabel
} from '../styled'

import { InputField } from './styled'

TextInput.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string.isRequired,
  styles: PropTypes.object,
  meta: PropTypes.object,
  isRequired: PropTypes.bool,
  isVisible: PropTypes.bool,
  container: PropTypes.element
}

TextInput.defaultProps = {
  input: null,
  meta: {},
  styles: {},
  isRequired: false,
  isVisible: true,
  container: InputContainer
}

export function TextInput(props) {
  if (props.isVisible === false) {
    return null
  }

  return (
    <props.container style={props.style}>
      {props.hasLabel && (
        <InputLabel hasError={props.meta.submitFailed && props.meta.error}>
          {props.label || props.placeholder}
          &nbsp;
          <InputRequired>{props.isRequired && '*'}</InputRequired>
        </InputLabel>
      )}

      <InputField
        {...props.input}
        autoComplete="Off"
        placeholder={props.placeholder}
        hasError={
          props.highlightOnError && props.meta.submitFailed && props.meta.error
        }
        {...props}
      />

      {props.showError && props.meta.error && props.meta.touched && (
        <InputError>{props.meta.error}</InputError>
      )}
    </props.container>
  )
}
