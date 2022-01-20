import { TextField, TextFieldProps } from '@material-ui/core'
import { Field } from 'react-final-form'

import { FinalFieldProps } from '../types'

export type FormTextFieldProps<T = string> = FinalFieldProps<TextFieldProps, T>

function FormTextField<T = string>({
  variant = 'outlined',
  size = 'small',
  fullWidth = true,
  margin = 'normal',
  helperText,
  parse,
  format,
  ...otherProps
}: FormTextFieldProps<T>) {
  return (
    <Field<T>
      {...otherProps}
      parse={parse}
      format={format}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      margin={margin}
      // The TextField of final-form-material-ui package does not respect the initial value of
      // helperText. There is an open PR for that and in the meanwhile we need to avoid using
      // the component.
      // https://github.com/Deadly0/final-form-material-ui/pull/23
      // component={TextField}
      render={({
        input: { name, onChange, value, ...restInput },
        meta,
        ...rest
      }) => {
        const showError =
          ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
          meta.touched

        return (
          <TextField
            {...rest}
            name={name}
            helperText={showError ? meta.error || meta.submitError : helperText}
            error={showError}
            inputProps={restInput}
            onChange={onChange}
            value={value}
          />
        )
      }}
    />
  )
}

export default FormTextField
