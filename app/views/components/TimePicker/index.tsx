import React from 'react'
import { TextField, TextFieldProps } from '@material-ui/core'

import useStyles from './styles'

export interface TimePickerProps
  extends Omit<
    TextFieldProps,
    'type' | 'InputLabelProps' | 'inputProps' | 'autoComplete'
  > {
  min?: string
  max?: string
  step?: number
  InputLabelProps?: Omit<TextFieldProps['InputLabelProps'], 'shrink'>
  inputProps?: Omit<TextFieldProps['inputProps'], 'step'>
}

function TimePicker({
  step = 5 * 60, // 5 min
  InputLabelProps,
  inputProps,
  fullWidth = true,
  size = 'small',
  variant = 'outlined',
  ...otherProps
}: TimePickerProps) {
  const classes = useStyles()

  return (
    <TextField
      {...otherProps}
      className={classes.input}
      type="time"
      autoComplete="off"
      InputLabelProps={{
        ...InputLabelProps,
        shrink: true
      }}
      inputProps={{
        ...inputProps,
        step
      }}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
    />
  )
}

export default TimePicker
