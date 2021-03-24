import React from 'react'
import { TextField, TextFieldProps } from '@material-ui/core'

import DomainPaymentFormCardElement, {
  DomainPaymentFormCardElementProps
} from './DomainPaymentFormCardElement'

export type DomainPaymentFormCardFieldProps = Omit<
  TextFieldProps,
  'InputProps' | 'onChange'
> &
  Pick<DomainPaymentFormCardElementProps, 'onChange'>

const inputProps = {
  inputComponent: DomainPaymentFormCardElement
}

function DomainPaymentFormCardField({
  inputRef,
  onChange,
  ...props
}: DomainPaymentFormCardFieldProps) {
  return (
    <TextField
      {...props}
      // The callback type is invalid because of the change material-ui limitations
      onChange={(onChange as unknown) as TextFieldProps['onChange']}
      InputProps={inputProps}
    />
  )
}

export default DomainPaymentFormCardField
