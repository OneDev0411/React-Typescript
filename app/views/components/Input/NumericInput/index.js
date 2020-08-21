import React from 'react'
import Input from 'react-text-mask'
import _ from 'underscore'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import InputErrorMessage from '../components/InputErrorMessage'

function validate(props) {
  const { value, min, max } = props

  if (min && parseFloat(value) < min) {
    return false
  }

  if (max && parseFloat(value) > max) {
    return false
  }

  return true
}

function getErrorMessage(props) {
  const { min, max } = props
  const errors = []

  if (min) {
    errors.push(`greater than ${min}`)
  }

  if (max) {
    errors.push(`lower than ${max}`)
  }

  return `value must be ${errors.join(' and ')}`
}

export default props => {
  const { value, placeholder, options, ErrorMessageHandler } = props
  const isValid = validate(props)

  const opts = {
    includeThousandsSeparator: false,
    allowNegative: false,
    allowDecimal: false,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: null,
    requireDecimal: false,
    ...(options || {})
  }

  const ErrorMessageComponent = ErrorMessageHandler ? (
    <ErrorMessageHandler message={getErrorMessage(props)} {...props} />
  ) : (
    <InputErrorMessage message={getErrorMessage(props)} />
  )

  return (
    <div style={{ position: 'relative', display: 'inline' }}>
      <Input
        placeholder={placeholder || ''}
        style={{
          border: isValid ? '' : '1px solid #ec4b35'
        }}
        value={value}
        mask={createNumberMask({
          prefix: '',
          suffix: '',
          includeThousandsSeparator: opts.includeThousandsSeparator,
          allowNegative: opts.allowNegative,
          allowLeadingZeroes: false,
          allowDecimal: opts.allowDecimal,
          decimalSymbol: opts.decimalSymbol,
          decimalLimit: opts.decimalLimit,
          integerLimit: opts.integerLimit,
          requireDecimal: opts.requireDecimal
        })}
        {..._.omit(props, 'ErrorMessageHandler', 'data-type', 'options')}
        onChange={e => {
          const maskedValue = e.target.value
          const originalValue = maskedValue
            ? maskedValue.replace(/\_/g, '')
            : maskedValue

          const data = {
            value: originalValue,
            isValid: props.value && validate(props)
          }

          props.onChange(e, data)
        }}
      />

      {value && !isValid && ErrorMessageComponent}
    </div>
  )
}
