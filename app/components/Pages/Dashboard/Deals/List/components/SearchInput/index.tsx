import { useEffect, useRef } from 'react'

import {
  InputProps,
  FilledInputProps,
  OutlinedInputProps
} from '@material-ui/core'
import useDebouncedCallback from 'use-debounce/lib/callback'

import { noop } from '@app/utils/helpers'
import { SearchInput } from 'components/GlobalHeaderWithSearch'

import { SEARCH_INPUT_DEBOUNCE_MS } from '../../BackOffice/constants'

interface Props {
  placeholder: string
  value: string | null
  InputProps?:
    | Partial<InputProps>
    | Partial<FilledInputProps>
    | Partial<OutlinedInputProps>
  onChange?: (value: string) => void
  onClick?: () => void
  autoFocus?: boolean
}

export function DebouncedSearchInput({
  value = '',
  placeholder,
  InputProps,
  onChange = noop,
  onClick,
  autoFocus
}: Props) {
  const [debouncedOnChange] = useDebouncedCallback(
    onChange,
    SEARCH_INPUT_DEBOUNCE_MS
  )
  const ref = useRef<HTMLInputElement>(null)

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(target.value)
  }

  useEffect(() => {
    if (autoFocus) {
      ref.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SearchInput
      ref={ref}
      onClick={onClick}
      defaultValue={value}
      placeholder={placeholder}
      onChange={handleChange}
      InputProps={InputProps}
    />
  )
}
