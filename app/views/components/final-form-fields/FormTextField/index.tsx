import React from 'react'
import { Field } from 'react-final-form'
import { TextField } from 'final-form-material-ui'
import type { TextFieldProps } from '@material-ui/core'

import { FinalFieldProps } from '../types'

export type FormTextFieldProps = FinalFieldProps<TextFieldProps>

function FormTextField({
  variant = 'outlined',
  size = 'small',
  fullWidth = true,
  margin = 'normal',
  ...otherProps
}: FormTextFieldProps) {
  return (
    <Field
      {...otherProps}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      margin={margin}
      component={TextField}
    />
  )
}

export default FormTextField
