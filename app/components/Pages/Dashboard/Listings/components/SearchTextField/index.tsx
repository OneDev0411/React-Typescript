import React from 'react'

import useDebouncedCallback from 'use-debounce/lib/callback'

import {
  SearchInput,
  SearchInputProps
} from 'components/GlobalHeaderWithSearch'

interface SearchTextFieldProps extends Omit<SearchInputProps, 'onChange'> {
  onChange: (value: string) => void
  delay?: number
}

function SearchTextField({
  onChange,
  delay = 500,
  placeholder = 'Search',
  ...otherProps
}: SearchTextFieldProps) {
  const [debouncedOnChange] = useDebouncedCallback(onChange, delay)

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(target.value)
  }

  return (
    <SearchInput
      {...otherProps}
      onChange={handleChange}
      placeholder={placeholder}
    />
  )
}

export default SearchTextField
