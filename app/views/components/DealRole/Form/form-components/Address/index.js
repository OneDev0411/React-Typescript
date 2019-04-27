import React from 'react'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'
import { Input } from 'components/inline-editable-fields/styled'

import {
  InputContainer,
  InputError,
  InputRequired,
  InputLabel
} from 'components/Forms/styled'

export function Address(props) {
  if (props.isVisible === false) {
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
        address={props.value}
        needsAddressForm={false}
        handleInputChange={props.input.onChange}
        renderSearchField={inputProps => (
          <Input
            {...inputProps}
            type="text"
            style={{
              padding: 0,
              border: 'none'
            }}
          />
        )}
      />

      {props.showError && props.meta.error && props.meta.touched && (
        <InputError>{props.meta.error}</InputError>
      )}
    </InputContainer>
  )
}
