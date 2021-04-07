import React from 'react'
import { Field, FieldProps } from 'react-final-form'

import SelectField, { SelectFieldProps } from 'components/SelectField'

export interface FormSelectFieldProps
  extends Omit<SelectFieldProps, 'defaultValue'>,
    Pick<FieldProps<string, any>, 'validate' | 'format'> {
  name: string
}

function FormSelectField({
  name,
  helperText,
  variant = 'outlined',
  size = 'small',
  fullWidth = true,
  margin = 'normal',
  validate,
  format,
  ...otherProps
}: FormSelectFieldProps) {
  return (
    <Field
      name={name}
      validate={validate}
      format={format}
      render={({ input, meta }) => {
        const hasError = meta.error && meta.touched

        return (
          <SelectField
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

export default FormSelectField
