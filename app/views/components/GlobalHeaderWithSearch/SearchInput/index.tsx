import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import {
  TextField,
  InputAdornment,
  makeStyles,
  IconButton,
  Theme
} from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { TextFieldProps } from '@material-ui/core/TextField'

import { useDebouncedCallback } from 'use-debounce'

import { mdiMagnify, mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import Loading from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    backgroundColor: theme.palette.grey['100'],
    border: 'none',
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.grey[600],
    height: theme.spacing(5.25),
    lineHeight: 'initial',
    padding: theme.spacing(0, 1.5)
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
      onChange = () => {},
      ...others
    }: SearchInputProps,
    ref
  ) => {
    const classes = useStyles()
    const theme = useTheme<Theme>()
    const [nonEmpty, setNonEmpty] = useState(false)
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
        // https://stackoverflow.com/questions/49081149/debounce-on-react-got-e-target-value-undefined?answertab=active#tab-top
        debouncedOnChange(e, value)

        return
      }

      onChange(e)
    }

    const clearInput = () => {
      if (inputEl && inputEl.current) {
        inputEl.current.value = ''

        if (onClear) {
          // A custom `onClear` routine may also be provided as a prop
          onClear()
          setNonEmpty(false)
        } else {
          // Since components using this TextField may rely on an standard `onChange`
          // event listener for getting the latest input value, we should respect it
          // and as soon as this gets cleared we notify them of the change. We could not
          // just go with setting the value to an empty string ('') here as it doesn't
          // trigger an `onChange` event. (They may want to reset their search results)
          // So, the approach we are taking is to manually trigger an `input` event on
          // the inputElement and let those listeners for their jobs.
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SvgIcon path={mdiMagnify} color={theme.palette.grey[600]} />
            </InputAdornment>
          ),
          endAdornment: (
            <>
              {isLoading && <Loading />}
              {nonEmpty && (
                <IconButton size="small" onClick={clearInput}>
                  <SvgIcon path={mdiClose} color={theme.palette.grey[600]} />
                </IconButton>
              )}
            </>
          ),
          className: classes.input
        }}
        style={widthStyle}
        inputRef={inputEl}
        onInput={handleInput}
        {...others}
      />
    )
  }
)
