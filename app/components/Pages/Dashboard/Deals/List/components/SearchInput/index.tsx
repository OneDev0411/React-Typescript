import useDebouncedCallback from 'use-debounce/lib/callback'

import { SearchInput } from '@app/views/components/SearchInput'

interface Props {
  placeholder: string
  value: string | null
  onChange: (value: string) => void
}

export function DebouncedSearchInput({
  value = '',
  placeholder,
  onChange
}: Props) {
  const [debouncedOnChange] = useDebouncedCallback(onChange, 500)

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(target.value)
  }

  return (
    <SearchInput
      defaultValue={value}
      placeholder={placeholder}
      onChange={handleChange}
    />
  )
}
