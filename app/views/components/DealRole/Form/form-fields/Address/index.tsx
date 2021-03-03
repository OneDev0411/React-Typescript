import React, { useRef } from 'react'

import { TextField } from '@material-ui/core'

import { FieldInputProps } from 'react-final-form'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import { normalizePostgressStdaddr } from 'components/inline-editable-fields/InlineAddressField/InlineAddressForm/helpers/normalize-postgres-stdaddr'

interface Address {
  city: string
  full: string
  house_num: string
  name: string
  postcode: string
  predir: string
  state: string
  suftype: string
  unit?: string
}

interface Props {
  name: string
  label: string
  isVisible: boolean
  input: FieldInputProps<any, HTMLElement>
}

export function Address({ name, label, isVisible, input }: Props) {
  const formRef = useRef<any>(null)

  const onAddressSubmit = (address: Address) => {
    formRef.current?.handleClose?.()

    input.onChange(address)
  }

  const onInputChange = (fullAddress: string) => {
    if (!fullAddress) {
      return input.onChange(null)
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <div>
      <InlineAddressField
        key={name}
        ref={formRef}
        address={input?.value?.full}
        handleInputChange={onInputChange}
        handleSubmit={onAddressSubmit}
        preSaveFormat={normalizePostgressStdaddr}
        renderSearchField={inputProps => (
          <TextField
            {...inputProps}
            fullWidth
            size="small"
            name={input.name}
            label={label}
            variant="outlined"
            autoComplete="disable-autocomplete"
          />
        )}
      />
    </div>
  )
}
