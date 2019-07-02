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

  return value && typeof value === 'object' && value.hasOwnProperty('full')
    ? value.full
    : value
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
    if (!fullAddress && props.needsAddressForm) {
      return props.input.onChange(null)
    }

    return props.input.onChange(fullAddress)
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
        needsAddressForm={props.needsAddressForm || false}
        handleInputChange={onInputChange}
        handleSubmit={onAddressSubmit}
        preSaveFormat={normalizePostgressStdaddr}
        renderSearchField={inputProps => (
          <Input {...inputProps} autoComplete="disable-autocomplete" />
        )}
      />

      <FieldError name={props.input.name} />
    </InputContainer>
  )
}
