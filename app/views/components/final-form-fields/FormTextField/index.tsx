import React from 'react'
import { TextField, TextFieldProps } from '@material-ui/core'
import { Field, FieldProps } from 'react-final-form'

export interface FormTextFieldProps
  extends Omit<TextFieldProps, 'name' | 'defaultValue'>,
    Pick<FieldProps<string, any>, 'validate' | 'format'> {
  name: string
}

function FormTextField({
  name,
  helperText,
  variant = 'outlined',
  size = 'small',
  fullWidth = true,
  margin = 'normal',
  validate,
  format,
  ...otherProps
}: FormTextFieldProps) {
  return (
    <Field
      name={name}
      validate={validate}
      format={format}
      render={({ input, meta }) => {
        const hasError = meta.error && meta.touched

        return (
          <TextField
            {...otherProps}
            {...input}
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            margin={margin}
            error={hasError}
            helperText={hasError ? meta.error : helperText}
          />
        )
      }}
    />
  )
}

export default FormTextField
