import React, { useState, useRef } from 'react'
import {
  TextField,
  InputAdornment,
  makeStyles,
  createStyles,
  IconButton,
  Theme
} from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { TextFieldProps } from '@material-ui/core/TextField'

import IconSearch from 'components/SvgIcons/Search/IconSearch'
import IconClose from 'components/SvgIcons/Close/CloseIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      backgroundColor: theme.palette.grey['100'],
      border: 'none',
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.grey[600],
      height: theme.spacing(5.25),
      lineHeight: 'initial',
      padding: theme.spacing(0, 2.5),
      width: '360px',
      '&&&:before': {
        borderBottom: 'none'
      },
      '&&:after': {
        borderBottom: 'none'
      }
    }
  })
)

export function SearchInput(props: TextFieldProps) {
  const classes = useStyles()
  const theme = useTheme<Theme>()
  const [nonEmpty, setNonEmpty] = useState(false)
  const inputEl = useRef<HTMLInputElement | null>(null)
  const { onChange, ...propsExceptOnChange } = props

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange: passedOnChange } = props

    const value = e.target.value

    if (typeof passedOnChange === 'function') {
      passedOnChange(e)
    }

    if (value) {
      setNonEmpty(true)
    } else {
      setNonEmpty(false)
    }
  }

  const clearInput = () => {
    if (inputEl && inputEl.current) {
      inputEl.current.value = ''

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

  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconSearch fill={theme.palette.grey[600]} />
          </InputAdornment>
        ),
        endAdornment: nonEmpty && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={clearInput}>
              <IconClose size="small" fillColor={theme.palette.grey[600]} />
            </IconButton>
          </InputAdornment>
        ),
        className: classes.input
      }}
      inputRef={inputEl}
      onInput={handleOnChange}
      {...propsExceptOnChange}
    />
  )
}
