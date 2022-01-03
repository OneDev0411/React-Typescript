import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'

import {
  TextField,
  InputAdornment,
  IconButton,
  makeStyles,
  Theme
} from '@material-ui/core'
import { TextFieldProps } from '@material-ui/core/TextField'
import { useTheme } from '@material-ui/styles'
import { mdiMagnify, mdiClose } from '@mdi/js'
import { useDebouncedCallback } from 'use-debounce'

import Loading from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    backgroundColor: theme.palette.grey[100],
    border: 'none',
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.action.active,
    height: theme.spacing(5.25),
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
  onClear?: () => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, value?: string) => void
}

export const SearchInput = forwardRef(
  (
    {
      fullWidth,
      onClear,
      isLoading,
      debounceTime = 0,
      defaultValue,
      onChange = () => {},
      InputProps,
      ...others
    }: SearchInputProps,
    ref
  ) => {
    const classes = useStyles()
    const theme = useTheme<Theme>()
    const [nonEmpty, setNonEmpty] = useState(Boolean(defaultValue))
    const inputEl = useRef<HTMLInputElement | null>(null)
    const widthStyle = { width: fullWidth ? '100%' : '360px' } // default width

    const [debouncedOnChange] = useDebouncedCallback(onChange, debounceTime, {
      maxWait: 2000
    })

    // Exposing some methods for the input el
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputEl && inputEl.current) {
          inputEl.current.focus()
        }
      },
      blur: () => {
        if (inputEl && inputEl.current) {
          inputEl.current.blur()
        }
      },
      clear: () => {
        if (inputEl && inputEl.current) {
          inputEl.current.value = ''
          setNonEmpty(false)
        }
      }
    }))

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value

      setNonEmpty(!!value)

      if (debounceTime > 0) {
        // https://stackoverflow.com/questions/49081149
        debouncedOnChange(e, value)

        return
      }

      onChange(e, value)
    }

    const clearInput = () => {
      if (inputEl && inputEl.current) {
        inputEl.current.value = ''

        if (typeof onClear === 'function') {
          // A custom `onClear` routine may also be provided as a prop
          onClear()
          setNonEmpty(false)
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
        defaultValue={defaultValue}
        color="secondary"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SvgIcon path={mdiMagnify} color={theme.palette.action.active} />
            </InputAdornment>
          ),
          endAdornment: (
            <>
              {isLoading && <Loading />}
              {nonEmpty && (
                <IconButton size="small" onClick={clearInput}>
                  <SvgIcon
                    path={mdiClose}
                    color={theme.palette.action.active}
                  />
                </IconButton>
              )}
            </>
          ),
          className: classes.input,
          ...InputProps
        }}
        style={widthStyle}
        inputRef={inputEl}
        onInput={handleInput}
        {...others}
      />
    )
  }
)
