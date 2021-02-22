import React, { useEffect, useState } from 'react'

import { TextField, CircularProgress } from '@material-ui/core'
import Autocomplete, {
  AutocompleteInputChangeReason
} from '@material-ui/lab/Autocomplete'

import { useAsync, useDebounce } from 'react-use'

export interface Option {
  label: string
  value: string
}

interface Props {
  label: string
  noOptionsText?: string
  options: Option[] | ((value: string) => Promise<Option[]>)
  isLoading?: boolean
  value?: string
  error?: string
  getOptionLabel?: (option: Option) => string
  onChange: (value: Option) => void
  onInputChange?: (value: string) => void
}

export function AutoComplete({
  label,
  options,
  value = '',
  error = '',
  onChange = () => {},
  onInputChange = () => {},
  getOptionLabel = option => option.label,
  noOptionsText = 'No Options',
  isLoading = false
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState(Array.isArray(options) ? options : [])
  const [inputValue, setInputValue] = useState(value)

  const [criteria, setCriteria] = useState('')
  const [debouncedCriteria, setDebouncedCriteria] = useState('')

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useDebounce(
    () => {
      setDebouncedCriteria(criteria)
    },
    500,
    [criteria]
  )

  useAsync(async () => {
    if (typeof options === 'function' && debouncedCriteria) {
      const data = await options(debouncedCriteria)

      setItems(data)
    }
  }, [debouncedCriteria])

  useEffect(() => {
    Array.isArray(options) && setItems(options)
  }, [options])

  const handleInputChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    if (reason !== 'input') {
      return
    }

    setInputValue(value)
    setCriteria(value)
    onInputChange(value)
  }

  const handleChange = (_: React.ChangeEvent<{}>, option: Option) => {
    onChange(option)
  }

  return (
    <Autocomplete
      disableClearable
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      getOptionSelected={(option, value) => option.label === value.label}
      getOptionLabel={getOptionLabel}
      options={items}
      loading={isLoading}
      groupBy={option => option.label.charAt(0).toLowerCase()}
      noOptionsText={noOptionsText}
      inputValue={inputValue}
      onChange={handleChange}
      onInputChange={handleInputChange}
      renderInput={params => {
        const props = {
          ...params,
          inputProps: {
            ...params.inputProps,
            autoComplete: 'no-auto'
          }
        }

        return (
          <TextField
            {...props}
            autoComplete="new-password"
            size="small"
            label={label}
            variant="outlined"
            error={!!error}
            helperText={error}
            InputProps={{
              ...props.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={15} />
                  ) : null}
                </>
              )
            }}
          />
        )
      }}
    />
  )
}
