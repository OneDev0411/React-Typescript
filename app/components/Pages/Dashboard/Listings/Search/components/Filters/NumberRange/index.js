import React from 'react'
import MinMaxInputs from '../components/MinMaxInputs'
import { toNumber } from '../../../../../../../../utils/helpers'

const _defaultFormatHandler = value => {
  if (!value || value == null) {
    return ''
  }

  return typeof value === 'number' ? value.toLocaleString() : toNumber(value, true)
}

const NumberRange = ({ formatHandler, ...rest }) => (
  <MinMaxInputs
    {...rest}
    formatHandler={
      typeof formatHandler === 'function' ? formatHandler : _defaultFormatHandler
    }
  />
)

export default NumberRange
