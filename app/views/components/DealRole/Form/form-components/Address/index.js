import React from 'react'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import {
  InputContainer,
  InputError,
  InputRequired,
  InputLabel
} from 'components/Forms/styled'

import { Input } from './styled'

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
        address={props.input.value}
        needsAddressForm={false}
        handleInputChange={props.input.onChange}
        renderSearchField={inputProps => (
          <Input {...inputProps} autoComplete="disable-autocomplete" />
        )}
      />

      {props.showError && props.meta.error && props.meta.touched && (
        <InputError>{props.meta.error}</InputError>
      )}
    </InputContainer>
  )
}
