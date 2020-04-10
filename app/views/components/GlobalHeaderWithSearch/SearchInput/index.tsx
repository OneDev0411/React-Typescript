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

import IconSearch from 'components/SvgIcons/Search/IconSearch'
import IconClose from 'components/SvgIcons/Close/CloseIcon'
import Loading from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    backgroundColor: theme.palette.grey['100'],
    border: 'none',
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.grey[600],
    height: theme.spacing(5.25),
    lineHeight: 'initial',
    padding: theme.spacing(0, 2.5),
    '&&&:before': {
      borderBottom: 'none'
    },
    '&&:after': {
      borderBottom: 'none'
    }
  }
}))

export type SearchInputProps = TextFieldProps & {
  isLoading?: boolean
  onClear?: () => void
}

export const SearchInput = forwardRef(
  (
    { fullWidth, onChange, onClear, isLoading, ...others }: SearchInputProps,
    ref
  ) => {
    const classes = useStyles()
    const theme = useTheme<Theme>()
    const [nonEmpty, setNonEmpty] = useState(false)
    const inputEl = useRef<HTMLInputElement | null>(null)
    const widthStyle = { width: fullWidth ? '100%' : '360px' } // default width

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
      }
    }))

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      onChange && onChange(e)

      if (value) {
        setNonEmpty(true)
      } else {
        setNonEmpty(false)
      }
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch fill={theme.palette.grey[600]} />
            </InputAdornment>
          ),
          endAdornment: (
            <>
              {isLoading && <Loading />}
              {nonEmpty && (
                <IconButton size="small" onClick={clearInput}>
                  <IconClose size="small" fillColor={theme.palette.grey[600]} />
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
