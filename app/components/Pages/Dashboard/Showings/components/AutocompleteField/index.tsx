import { ChangeEvent, ReactNode, useState } from 'react'

import {
  TextField,
  TextFieldProps,
  CircularProgress,
  makeStyles
} from '@material-ui/core'
import Autocomplete, {
  AutocompleteInputChangeReason,
  AutocompleteProps
} from '@material-ui/lab/Autocomplete'
import classNames from 'classnames'
import { useDebouncedCallback } from 'use-debounce/lib'

import useAsync from 'hooks/use-async'

const useStyles = makeStyles(
  {
    rootFullWidth: { width: '100%' }
  },
  { name: 'AutocompleteField' }
)

export interface BaseOption {
  label: string
  value: string
}

export interface AutocompleteFieldProps<T extends BaseOption = BaseOption>
  extends Pick<
      AutocompleteProps<T, undefined, true, true>,
      | 'loading'
      | 'getOptionLabel'
      | 'value'
      | 'defaultValue'
      | 'inputValue'
      | 'groupBy'
      | 'getOptionSelected'
      | 'className'
    >,
    Pick<
      TextFieldProps,
      'label' | 'error' | 'helperText' | 'fullWidth' | 'margin' | 'required'
    > {
  noOptionsText?: ReactNode | ((loading: boolean) => ReactNode)
  options: T[] | ((value: string) => Promise<T[]>)
  defaultInputValue?: string
  onChange?: (value: T) => void
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void
  searchDelay?: number
}

const getOptionLabelDefault = (option: BaseOption) => option.label || ''

const getGroupByDefault = (option: BaseOption) =>
  option.label ? option.label.charAt(0).toLowerCase() : ''

const getOptionSelectedDefault = (option: BaseOption, value: BaseOption) =>
  option.label === value.label

function AutocompleteField<T extends BaseOption = BaseOption>({
  className,
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
  searchDelay = 500,
  fullWidth = true,
  margin = 'normal',
  required
}: AutocompleteFieldProps<T>) {
  const classes = useStyles()

  const [inputValue, setInputValue] =
    useState<Optional<string>>(defaultInputValue)

  const {
    data: results,
    run,
    isLoading,
    error: resultsError
  } = useAsync<T[]>({
    data: []
  })

  const [debouncedRunOptions] = useDebouncedCallback((value: string) => {
    if (typeof options === 'function') {
      run(async () => options(value))
    }
  }, searchDelay)

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
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

    onInputChange?.(event)
  }

  const handleChange = (_: React.ChangeEvent<{}>, option: NonNullable<T>) => {
    onChange?.(option)
  }

  const endAdornment =
    loading || isLoading ? <CircularProgress color="inherit" size={15} /> : null

  return (
    <Autocomplete<T, undefined, true, true>
      className={classNames(className, fullWidth && classes.rootFullWidth)}
      disableClearable
      freeSolo
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      options={typeof options === 'function' ? results : options}
      loading={loading || isLoading}
      groupBy={groupBy}
      noOptionsText={
        typeof noOptionsText === 'function'
          ? noOptionsText(loading || isLoading)
          : noOptionsText
      }
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
            fullWidth={fullWidth}
            margin={margin}
            required={required}
          />
        )
      }}
    />
  )
}

export default AutocompleteField
