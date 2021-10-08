import React, { useRef, forwardRef, useImperativeHandle } from 'react'

import {
  TextField,
  makeStyles,
  Theme,
  CircularProgress,
  IconButton
} from '@material-ui/core'
import { InputProps } from '@material-ui/core/Input'
import { InputBaseProps } from '@material-ui/core/InputBase'
import { TextFieldProps } from '@material-ui/core/TextField'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import { useDebouncedCallback } from 'use-debounce'

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    backgroundColor: theme.palette.grey[100],
    border: 'none',
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.action.active,
    height: theme.spacing(5),
    lineHeight: 'initial',
    padding: theme.spacing(0, 1.5),
    /*
      I'm doing this because action btn across the different pages
      in the header has a different design with the search text
      field so it looks inconsistent, so I made this change
      to have consistent design
    */
    '&:after, &:before': {
      borderBottom: 0
    },
    '&:hover': {
      '&:not(.Mui-disabled):after, &:not(.Mui-disabled):before': {
        borderBottom: 0
      }
    }
  }
}))

export type SearchInputProps = TextFieldProps & {
  isLoading?: boolean
  debounceTime?: number
  minChars?: number
  onClearHandler?: () => void
  onChangeHandler?: (
    e: React.ChangeEvent<HTMLInputElement>,
    value?: string
  ) => void
  // Be aware that for MUI's TextField component, 'inputProps' and 'InputProps'
  // are different. The former is used for TextField's HTML input arttibutes,
  // while the latter is props applied to the MUI's Input element.
  // More info on: https://material-ui.com/api/text-field/
  InputProps?: InputProps
  inputProps?: InputBaseProps
  disableClearButton?: boolean
  value?: string
  defaultValue?: string
}
export type SearchInputExposedMethods = {
  focus: () => void
  blur: () => void
  clear: () => void
  getInputEl: () => HTMLInputElement | null
}

export const SearchInput = forwardRef(
  (
    {
      isLoading,
      debounceTime = 0,
      onClearHandler,
      onChangeHandler = () => {},
      fullWidth,
      defaultValue,
      InputProps,
      inputProps,
      disableClearButton = false,
      minChars = 0,
      value,
      ...textFieldProps
    }: SearchInputProps,
    ref
  ) => {
    const classes = useStyles()
    const inputEl = useRef<HTMLInputElement>(null)
    const widthStyle = { width: fullWidth ? '100%' : '360px' } // default width

    const [debouncedOnChange] = useDebouncedCallback(
      onChangeHandler,
      debounceTime,
      {
        maxWait: 2000
      }
    )

    // Exposing some methods for the input el
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputEl.current?.focus()
      },
      blur: () => {
        inputEl.current?.blur()
      },
      clear: () => {
        if (inputEl && inputEl.current) {
          inputEl.current.value = ''
        }
      },
      getInputEl: () => {
        return inputEl.current
      }
    }))

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value

      if (value.length >= minChars) {
        if (debounceTime > 0) {
          // https://stackoverflow.com/questions/49081149
          debouncedOnChange(e, value)

          return
        }

        onChangeHandler(e, value)
      }
    }

    const clearInput = () => {
      if (inputEl && inputEl.current) {
        inputEl.current.value = ''

        if (typeof onClearHandler === 'function') {
          // A custom `onClearHandler` routine may also be provided as a prop
          onClearHandler()
        } else {
          // Since components using this TextField may rely on an standard `onChange`
          // event listener for getting the latest input value, we should respect
          // that and as soon as this input gets cleared we notify them of the change
          // We could not just go with setting the value to an empty string ('') here
          // as it doesn't trigger an `onChange` event. (They may want to reset their
          // search results)
          // So the approach we are taking is to manually triggering an `input` event
          // on the inputElement and let those listeners do their job.
          // More on this: https://stackoverflow.com/questions/23892547

          // Another thing we're doing here is removing the original `onChange` from
          // props and replacing it with an `onInput` listener. (See `render`)
          inputEl.current.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }
    }

    return (
      <TextField
        color="secondary"
        defaultValue={defaultValue}
        inputProps={{ ...inputProps, value }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        InputProps={{
          ...InputProps,
          startAdornment: <SearchIcon />,
          endAdornment: (
            <>
              {isLoading && <CircularProgress size={20} thickness={6} />}
              {inputEl.current?.value && !disableClearButton && (
                <IconButton
                  size="small"
                  aria-label="clear"
                  onClick={clearInput}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </>
          ),
          className: classes.input
        }}
        style={widthStyle}
        inputRef={inputEl}
        onInput={handleInput}
        {...textFieldProps}
      />
    )
  }
)
