import { useState, useEffect, useMemo } from 'react'

import { getTextAlignment } from '@app/components/Pages/Dashboard/Deals/utils/get-text-alignment'

import { AddressEdit } from './AddressEdit'
import { AddressWithSuggestion } from './AddressWithSuggestion'
import { NotEditable } from './NotEditable'

export function AddressField({
  deal,
  upsertContexts,
  onAddressUpdate,
  onToggleUnlink,
  annotations,
  formValues,
  ...inputProps
}) {
  const [inputValue, setInputValue] = useState(inputProps.value)

  useEffect(() => {
    setInputValue(inputProps.value)
  }, [inputProps.value])

  const inputStyles = useMemo(
    () => ({
      backgroundColor: '#d2e5f2',
      border: '1px solid #ccc',
      top: 0,
      left: 0,
      width: '100%',
      textAlign: getTextAlignment(inputProps.annotation.annotation)
    }),
    [inputProps.annotation.annotation]
  )

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
        onToggleUnlink={onToggleUnlink}
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
      onToggleUnlink={onToggleUnlink}
    />
  )
}
