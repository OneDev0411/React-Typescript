import React, { useRef } from 'react'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import { normalizePostgressStdaddr } from 'components/inline-editable-fields/InlineAddressField/InlineAddressForm/helpers/normalize-postgres-stdaddr'

import {
  InputContainer,
  InputRequired,
  InputLabel
} from 'components/Forms/styled'

import { Input } from './styled'
import { FieldError } from '../../../../final-form-fields/FieldError'

function getInitialAddress(input) {
  const { value } = input

  return value && value.full
}

export function Address(props) {
  const formRef = useRef(null)

  if (!props.isVisible) {
    return false
  }

  const onAddressSubmit = address => {
    formRef.current.handleFormCancel()

    props.input.onChange(address)
  }

  const onInputChange = fullAddress => {
    if (!fullAddress) {
      return props.input.onChange(null)
    }
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
        ref={formRef}
        address={getInitialAddress(props.input)}
        handleInputChange={onInputChange}
        handleSubmit={onAddressSubmit}
        preSaveFormat={normalizePostgressStdaddr}
        renderSearchField={inputProps => (
          <Input
            {...inputProps}
            name={props.input.name}
            autoComplete="disable-autocomplete"
          />
        )}
      />

      <FieldError name={props.input.name} />
    </InputContainer>
  )
}
