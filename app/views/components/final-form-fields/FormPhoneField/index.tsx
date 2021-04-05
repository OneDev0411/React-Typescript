import React from 'react'

import { formatPhoneNumber } from 'utils/format'

import { isValidPhoneNumber } from 'utils/helpers'

import FormTextField, { FormTextFieldProps } from '../FormTextField'

export interface FormPhoneFieldProps
  extends Omit<FormTextFieldProps, 'validate' | 'format'> {
  name: string
  format?: boolean
}

const validate = async value => {
  if (await isValidPhoneNumber(value || '')) {
    return 'Invalid Phone Number'
  }
}

function FormPhoneField({ format = true, ...otherProps }: FormPhoneFieldProps) {
  return (
    <FormTextField
      {...otherProps}
      format={format ? formatPhoneNumber : undefined}
      validate={validate}
    />
  )
}

export default FormPhoneField
