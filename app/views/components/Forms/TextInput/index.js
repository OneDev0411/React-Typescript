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
  hasLabel: PropTypes.bool,
  isRequired: PropTypes.bool,
  isVisible: PropTypes.bool,
  showError: PropTypes.bool,
  highlightOnError: PropTypes.bool,
  container: PropTypes.element
}

TextInput.defaultProps = {
  input: null,
  meta: {},
  styles: {},
  hasLabel: true,
  isRequired: false,
  isVisible: true,
  showError: true,
  highlightOnError: true,
  container: InputContainer
}

export function TextInput(props) {
  return (
    <props.container
      style={{
        ...props.style,
        display: props.isVisible ? 'block' : 'hidden'
      }}
    >
      {props.hasLabel && (
        <InputLabel hasError={props.meta.submitFailed && props.meta.error}>
          {props.label || props.placeholder}
          &nbsp;
          <InputRequired>{props.isRequired && '*'}</InputRequired>
        </InputLabel>
      )}

      <InputField
        autoComplete="Off"
        placeholder={props.placeholder}
        hasError={props.highlightOnError && props.meta.error}
        {...props}
      />

      {props.showError && props.meta.error && props.meta.touched && (
        <InputError>{props.meta.error}</InputError>
      )}
    </props.container>
  )
}
