import React, { useState, useEffect } from 'react'

import { AddressEdit } from './AddressEdit'
import { AddressWithSuggestion } from './AddressWithSuggestion'

import { NotEditable } from './NotEditable'

const inputStyles = {
  backgroundColor: '#d2e5f2',
  border: '1px solid #ccc',
  top: 0,
  left: 0
}

export function AddressField({
  deal,
  upsertContexts,
  onAddressUpdate,
  annotations,
  formValues,
  ...inputProps
}) {
  const [inputValue, setInputValue] = useState(inputProps.value)

  useEffect(() => {
    setInputValue(inputProps.value)
  }, [inputProps.value])

  if (deal.listing) {
    return <NotEditable style={inputProps.style} value={inputProps.value} />
  }

  if (
    ['full_address', 'street_address'].includes(
      inputProps.annotation.context
    ) === false
  ) {
    return (
      <AddressEdit
        inputValue={inputValue}
        style={inputProps.style}
        rect={inputProps.rect}
        inputStyles={inputStyles}
        annotations={annotations}
        formValues={formValues}
        onSave={onAddressUpdate}
      />
    )
  }

  return (
    <AddressWithSuggestion
      style={inputProps.style}
      rect={inputProps.rect}
      rectIndex={inputProps.rectIndex}
      inputValue={inputValue}
      inputStyles={inputStyles}
      onChange={setInputValue}
      onSave={onAddressUpdate}
    />
  )
}
