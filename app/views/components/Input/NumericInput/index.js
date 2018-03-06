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

export default props => {
  const { min, max, value, placeholder, options, ErrorMessageHandler } = props
  const isValid = validate(props)

  const opts = Object.assign(
    {
      includeThousandsSeparator: false,
      allowNegative: false,
      allowDecimal: false,
      decimalSymbol: '.',
      decimalLimit: 2,
      integerLimit: null,
      requireDecimal: false
    },
    options || {}
  )

  const ErrorMessageComponent = ErrorMessageHandler ? (
    <ErrorMessageHandler {...props} />
  ) : (
    <InputErrorMessage
      message={`value must be greater than ${min} and lower than ${max}`}
    />
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
          props.onChange(e, {
            isValid: props.value && validate(props)
          })
        }}
      />

      {value && !isValid && ErrorMessageComponent}
    </div>
  )
}
