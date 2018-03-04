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
  const { min, max, ErrorMessageHandler } = props
  const isValid = validate(props)

  const opts = Object.assign(
    {
      allowNegative: false,
      allowDecimal: false
    },
    props.options || {}
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
        placeholder={props.placeholder || ''}
        style={{
          border: isValid ? '' : '1px solid #ec4b35'
        }}
        mask={createNumberMask({
          prefix: '',
          suffix: '',
          includeThousandsSeparator: false,
          allowNegative: opts.allowNegative,
          allowLeadingZeroes: false,
          allowDecimal: opts.allowDecimal
        })}
        {..._.omit(props, 'ErrorMessageHandler', 'data-type')}
      />

      {props.value && !isValid && ErrorMessageComponent}
    </div>
  )
}
