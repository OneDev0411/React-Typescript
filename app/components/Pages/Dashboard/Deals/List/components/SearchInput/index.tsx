import React, { useState, useEffect } from 'react'
import useDebouncedCallback from 'use-debounce/lib/callback'

import { SearchInput } from 'components/GlobalHeaderWithSearch'

interface Props {
  placeholder: string
  defaultValue: string
  onChange: (value: string) => void
}

export function DebouncedSearchInput({
  defaultValue,
  placeholder,
  onChange
}: Props) {
  const [value, setValue] = useState(defaultValue)
  const [debouncedOnChange] = useDebouncedCallback(onChange, 500)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(target.value)
    debouncedOnChange(target.value)
  }

  return (
    <SearchInput
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
    />
  )
}
