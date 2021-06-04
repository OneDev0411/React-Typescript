import { ChangeEvent, ReactNode, useState } from 'react'

import { TextField, CircularProgress } from '@material-ui/core'
import Autocomplete, {
  AutocompleteInputChangeReason,
  AutocompleteProps
} from '@material-ui/lab/Autocomplete'

import { useDebouncedCallback } from 'use-debounce/lib'

import useAsync from 'hooks/use-async'

export interface Option {
  label: string
  value: string
}

export interface AutocompleteFieldProps<T extends Option = Option>
  extends Pick<
    AutocompleteProps<T, undefined, true, true>,
    | 'noOptionsText'
    | 'loading'
    | 'getOptionLabel'
    | 'value'
    | 'defaultValue'
    | 'inputValue'
    | 'groupBy'
    | 'getOptionSelected'
  > {
  label: string
  options: T[] | ((value: string) => Promise<T[]>)
  defaultInputValue?: string
  onChange?: (value: T) => void
  error?: boolean
  helperText?: ReactNode
  onInputChange?: (value: string) => void
  searchDelay?: number
}

const getOptionLabelDefault = (option: Option) => option.label || ''

const getGroupByDefault = (option: Option) =>
  option.label ? option.label.charAt(0).toLowerCase() : ''

const getOptionSelectedDefault = (option: Option, value: Option) =>
  option.label === value.label

function AutocompleteField<T extends Option = Option>({
  label,
  value,
  defaultValue,
  options,
  defaultInputValue,
  inputValue: outInputValue,
  error,
  helperText,
  onChange,
  onInputChange,
  getOptionLabel = getOptionLabelDefault,
  groupBy = getGroupByDefault,
  getOptionSelected = getOptionSelectedDefault,
  noOptionsText = 'No Options',
  loading,
  searchDelay = 500
}: AutocompleteFieldProps<T>) {
  const [inputValue, setInputValue] = useState<Optional<string>>(
    defaultInputValue
  )

  const { data: results, run, isLoading, error: resultsError } = useAsync<T[]>({
    data: []
  })

  const [debouncedRunOptions] = useDebouncedCallback((value: string) => {
    if (typeof options === 'function') {
      run(async () => options(value))
    }
  }, searchDelay)

  const handleInputChange = (
    _: ChangeEvent<HTMLInputElement>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    if (reason !== 'input') {
      return
    }

    // update the internal state if there is no external state
    if (value === undefined) {
      setInputValue(value)
    }

    // fetch the options if needed
    if (typeof options === 'function') {
      debouncedRunOptions(value)
    }

    onInputChange?.(value)
  }

  const handleChange = (_: React.ChangeEvent<{}>, option: NonNullable<T>) => {
    onChange?.(option)
  }

  const endAdornment =
    loading || isLoading ? <CircularProgress color="inherit" size={15} /> : null

  return (
    <Autocomplete<T, undefined, true, true>
      disableClearable
      freeSolo
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      options={typeof options === 'function' ? results : options}
      loading={loading || isLoading}
      groupBy={groupBy}
      noOptionsText={noOptionsText}
      value={value}
      defaultValue={defaultValue}
      inputValue={outInputValue === undefined ? inputValue : outInputValue}
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
            size="small"
            label={label}
            variant="outlined"
            error={!!resultsError || error}
            helperText={resultsError ? resultsError.toString() : helperText}
            InputProps={{
              ...props.InputProps,
              endAdornment: props.InputProps.endAdornment || endAdornment
            }}
          />
        )
      }}
    />
  )
}

export default AutocompleteField
