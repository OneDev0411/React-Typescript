import React, { useState } from 'react'
import useDebouncedCallback from 'use-debounce/lib/callback'

import { SearchInput } from 'components/GlobalHeaderWithSearch'

interface Props {
  placeholder: string
  defaultValue?: string
  onChange: (value: string) => void
}

export function DebouncedSearchInput(props: Props) {
  const [value, setValue] = useState(props.defaultValue || '')
  const [debouncedOnChange] = useDebouncedCallback(props.onChange, 500)

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(target.value)
    debouncedOnChange(target.value)
  }

  return (
    <SearchInput
      value={value}
      placeholder={props.placeholder}
      onChange={handleChange}
    />
  )
}
