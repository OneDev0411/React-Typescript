import { FieldState } from 'final-form'
import React from 'react'

import { formatPhoneNumber } from 'utils/format'

import { isValidPhoneNumber } from 'utils/helpers'

import FormTextField, { FormTextFieldProps } from '../FormTextField'

export interface FormPhoneFieldProps
  extends Omit<FormTextFieldProps, 'format'> {
  format?: boolean
}

function FormPhoneField({
  format = true,
  validate,
  ...otherProps
}: FormPhoneFieldProps) {
  const validateFormat = async (
    value: string,
    allValues: object,
    meta?: FieldState<string> | undefined
  ) => {
    if (!(await isValidPhoneNumber(value || ''))) {
      return 'Invalid Phone Number'
    }

    if (validate) {
      return validate(value, allValues, meta)
    }
  }

  return (
    <FormTextField
      {...otherProps}
      format={format ? formatPhoneNumber : undefined}
      validate={validateFormat}
    />
  )
}

export default FormPhoneField
