import React from 'react'
import { TextField, TextFieldProps } from '@material-ui/core'

import DomainPaymentFormCardElement from './DomainPaymentFormCardElement'

type DomainPaymentFormCardFieldProps = Omit<TextFieldProps, 'InputProps'>

const inputProps = {
  inputComponent: DomainPaymentFormCardElement
}

function DomainPaymentFormCardField({
  inputRef,
  ...props
}: DomainPaymentFormCardFieldProps) {
  return <TextField {...props} InputProps={inputProps} />
}

export default DomainPaymentFormCardField
