import React from 'react'
import { FieldInputProps, FieldMetaState } from 'react-final-form'

import { AutoComplete, Option } from '../../components/AutoComplete'

interface Props {
  input: FieldInputProps<any, HTMLElement>
  meta: FieldMetaState<any>
  label: string
  isVisible: boolean
  isRequired: boolean
  options: Option[]
}

export function AutoCompleteInput({
  input,
  meta,
  label,
  isVisible,
  isRequired,
  options
}: Props) {
  if (!isVisible) {
    return null
  }

  return (
    <AutoComplete
      label={`${label}${isRequired ? ' *' : ''}`}
      error={meta.error || (isRequired && !input.value)}
      value={input.value}
      options={options}
      onChange={option => input.onChange(option.value)}
      onInputChange={input.onChange}
    />
  )
}
