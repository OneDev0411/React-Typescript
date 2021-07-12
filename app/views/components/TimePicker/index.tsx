import { TextField, TextFieldProps } from '@material-ui/core'

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
  return (
    <TextField
      {...otherProps}
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
