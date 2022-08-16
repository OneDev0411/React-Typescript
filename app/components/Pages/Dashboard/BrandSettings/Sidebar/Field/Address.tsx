import useDebouncedCallback from 'use-debounce/lib/callback'

import DealsAndListingsAndPlacesSearchInput from '@app/views/components/DealsAndListingsAndPlacesSearchInput'

import { FieldProps } from './types'

export default function AddressField({
  value = '',
  names,
  onChange,
  ...props
}: FieldProps) {
  const [debouncedOnChange] = useDebouncedCallback(onChange, 300)

  const handleChange = (newValue: string) => {
    debouncedOnChange(names, newValue)
  }

  return (
    <DealsAndListingsAndPlacesSearchInput
      textFieldProps={{
        label: 'Address',
        variant: 'outlined',
        size: 'small'
      }}
      initialValue={value}
      {...props}
      searchTypes={['place']}
      onInput={handleChange}
    />
  )
}
