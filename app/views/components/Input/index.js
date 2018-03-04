import React from 'react'
import CurrencyInput from './CurrencyInput'
import EmailInput from './EmailInput'
import NumberInput from './NumericInput'
import PhoneInput from './PhoneInput'
import GenericInput from './GenericInput'

export default props => {
  switch (props['data-type'].toLowerCase()) {
    case 'currency':
      return <CurrencyInput {...props} />
    case 'number':
    case 'numeric':
      return <NumberInput {...props} />
    case 'phone':
      return <PhoneInput {...props} />
    case 'email':
      return <EmailInput {...props} />
  }

  return <GenericInput {...props} />
}
