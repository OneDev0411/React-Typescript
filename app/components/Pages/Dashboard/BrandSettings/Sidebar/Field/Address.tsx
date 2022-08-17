import { useRef } from 'react'

import { TextField } from '@material-ui/core'

import { InlineAddressField } from '@app/views/components/inline-editable-fields/InlineAddressField'
import { normalizePostgressStdaddr } from '@app/views/components/inline-editable-fields/InlineAddressField/InlineAddressForm/helpers/normalize-postgres-stdaddr'

import { AddressFieldValue, FieldProps } from './types'

export default function AddressField({
  value,
  names,
  onChange
}: FieldProps<AddressFieldValue>) {
  const formRef = useRef<any>(null)

  const handleChange = (newValue: AddressFieldValue) => {
    formRef.current?.handleClose?.()
    onChange(names, newValue)
  }

  return (
    <InlineAddressField
      ref={formRef}
      address={value?.full ?? ''}
      handleSubmit={handleChange}
      preSaveFormat={normalizePostgressStdaddr}
      PopoverProps={{
        anchorOrigin: {
          vertical: 'top',
          horizontal: -290 // TODO: fix popover ref problem
        },
        transformOrigin: {
          vertical: 'bottom',
          horizontal: 'left'
        }
      }}
      renderSearchField={({ isLoading, ...otherInputProps }) => (
        <TextField
          {...otherInputProps}
          fullWidth
          variant="outlined"
          size="small"
          label="Address"
          autoComplete="disable-autocomplete"
        />
      )}
    />
  )
}
