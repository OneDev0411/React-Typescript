import React from 'react'
import pure from 'recompose/pure'

import MinMaxInputs from '../components/MinMaxInputs'

const currentYear = () => {
  const date = new Date()
  return date.getFullYear()
}
const maxValue = year =>
  year && Number(year) > currentYear()
    ? `Must be maximum ${currentYear()}`
    : undefined

const minLength = limit => value =>
  value && value.length < limit ? `Must be ${limit} numbers` : undefined
const minLength4 = minLength(4)

const tooOld = year =>
  year && Number(year) < 1889
    ? 'You might be search museums for this!'
    : undefined

const formatHandler = value =>
  value == null ? '' : Number(value.replace(/[^0-9]/g, ''))

const YearBuilt = () =>
  <MinMaxInputs
    name="year_built"
    label="Year Built"
    formatHandler={formatHandler}
    validateMin={[minLength4, maxValue]}
    validateMax={[minLength4, maxValue]}
    warnMin={tooOld}
    humanNumber={false}
  />

export default pure(YearBuilt)
