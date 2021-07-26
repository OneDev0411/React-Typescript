import React from 'react'

import CurrencyInput from './CurrencyInput'
import EmailInput from './EmailInput'
import GenericInput from './GenericInput'
import NumberInput from './NumericInput'

export default props => {
  switch (props['data-type'].toLowerCase()) {
    case 'currency':
      return <CurrencyInput {...props} />
    case 'number':
    case 'numeric':
      return <NumberInput {...props} />
    case 'email':
      return <EmailInput {...props} />
  }

  return <GenericInput {...props} />
}
