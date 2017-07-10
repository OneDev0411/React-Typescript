import React from 'react'
import pure from 'recompose/pure'

import MinMaxInputs from '../components/MinMaxInputs'

const formatHandler = value =>
  value == null ? '' : Number(value.replace(/[^0-9]/g, '')).toLocaleString()

const PriceRange = () =>
  <MinMaxInputs
    placeholder="$Any"
    label="Price Range"
    minName="minimum_price"
    maxName="maximum_price"
    formatHandler={formatHandler}
  />

export default pure(PriceRange)
