import React from 'react'

import MinMaxInputs from '../components/MinMaxInputs'
import { toNumber } from '../../../../../../../../utils/helpers'

const currentYear = () => {
  const date = new Date()

  return date.getFullYear()
}
const maxValue = year =>
  year && Number(year) > currentYear()
    ? `Must be maximum ${currentYear()}`
    : undefined

const exactLength = limit => value =>
  value && value.length !== limit ? `Must be ${limit} numbers` : undefined
const exactLength4 = exactLength(4)

const tooOld = year =>
  year && Number(year) < 1800 ? 'You might search museums for this!' : undefined

const formatHandler = value => (value == null ? '' : toNumber(value))

const YearBuilt = () => (
  <MinMaxInputs
    name="year_built"
    label="Year Built"
    formatHandler={formatHandler}
    validateMin={[exactLength4, maxValue]}
    validateMax={[exactLength4, maxValue]}
    warnMin={tooOld}
    humanNumber={false}
  />
)

export default YearBuilt
