import React from 'react'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import {
  InputContainer,
  InputRequired,
  InputLabel
} from 'components/Forms/styled'

import { Input } from './styled'
import { FieldError } from '../../../../final-form-fields/FieldError'

function getInitialAddress(input) {
  const { value } = input

  return value && typeof value === 'object' && value.hasOwnProperty('full')
    ? value.full
    : value
}

export function Address(props) {
  if (!props.isVisible) {
    return false
  }

  return (
    <InputContainer style={props.style}>
      <InputLabel hasError={props.meta.submitFailed && props.meta.error}>
        {props.label}
        &nbsp;
        <InputRequired>{props.isRequired && '*'}</InputRequired>
      </InputLabel>

      <InlineAddressField
        key={props.name}
        address={getInitialAddress(props.input)}
        needsAddressForm={props.needsAddressForm || false}
        // handleInputChange={props.input.onChange}
        handleSubmit={props.input.onChange}
        renderSearchField={inputProps => (
          <Input {...inputProps} autoComplete="disable-autocomplete" />
        )}
      />

      {props.showError && <FieldError name={props.input.name} />}
    </InputContainer>
  )
}
