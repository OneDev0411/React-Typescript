import { useRef } from 'react'

import { TextField, InputAdornment, IconButton } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import { InlineAddressField } from '@app/views/components/inline-editable-fields/InlineAddressField'
import { normalizePostgressStdaddr } from '@app/views/components/inline-editable-fields/InlineAddressField/InlineAddressForm/helpers/normalize-postgres-stdaddr'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { AddressProps } from './types'

export default function AddressField({
  value,
  names,
  onChange
}: AddressProps<Nullable<BrandMarketingPaletteAddressValue>>) {
  const formRef = useRef<any>(null)

  const handleChange = (newValue: BrandMarketingPaletteAddressValue) => {
    formRef.current?.handleClose?.()
    onChange(names, newValue)
  }

  const handleDelete = () => {
    onChange(names, null)
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
      renderSearchField={({
        isFinalAddress,
        isLoading,
        ...otherInputProps
      }) => (
        <TextField
          {...otherInputProps}
          fullWidth
          variant="outlined"
          size="small"
          label="Address"
          autoComplete="disable-autocomplete"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disabled={!isFinalAddress}
                  size="small"
                  onClick={handleDelete}
                >
                  <SvgIcon path={mdiTrashCanOutline} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      )}
    />
  )
}
