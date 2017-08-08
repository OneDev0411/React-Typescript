import React from 'react'
import pure from 'recompose/pure'

import MinMaxInputs from '../components/MinMaxInputs'

const _defaultFormatHandler = value =>
  value == null ? '' : Number(value.replace(/[^0-9]/g, '')).toLocaleString()

const NumberRange = ({ formatHandler, ...rest }) =>
  <MinMaxInputs
    {...rest}
    formatHandler={
      typeof formatHandler === 'function'
        ? formatHandler
        : _defaultFormatHandler
    }
  />

export default pure(NumberRange)
